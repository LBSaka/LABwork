from flask import Flask, send_from_directory, request, render_template, jsonify, session
from pathlib import Path
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os
from demo_data import reset_demo_data
BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
TEMPLATES_DIR = FRONTEND_DIR / "templates"
STATIC_DIR = FRONTEND_DIR / "static"
DB_NAME = os.environ.get("DB_NAME", "labwork.db")

app = Flask(
    __name__,
    template_folder=str(TEMPLATES_DIR),
    static_folder=str(STATIC_DIR),
    static_url_path="/static",
)

app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-this-later")

@app.get("/")
def home():
    return render_template("base.html")
def login_required(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({
                "error": "Login required"
            }), 401
        return route_function(*args, **kwargs)
    return wrapper

@app.get("/static/<path:filename>")
def static_files(filename): return send_from_directory(FRONTEND_DIR, filename)

@app.get("/health")
def health():
    return {"status": "ok"}
@app.post("/api/signup")
def signup():
    data = request.get_json()
    
    username = data.get("username", "").strip()
    password = data.get("password", "")
    
    if not username or not password:
        return jsonify({
            "error": "Missing signup fields"
        }), 400
    password_hash = generate_password_hash(password)

    conn = get_db_connection()

    try:
        cursor = conn.execute("""
                              INSERT INTO users (username, password_hash)
                              VALUES (?, ?)
                              """, (username, password_hash))
        conn.commit()

    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({
            "error": "Username already exists"
        }), 400
    user_id = cursor.lastrowid
    conn.close()
    session["user_id"] = user_id
    session["username"] = username

    return jsonify({
        "ok": True
    }), 201

@app.post("/api/demo-login")
def demo_login():
    demo_username = "John LABwork"

    conn = get_db_connection()

    demo_user = conn.execute("""
        SELECT id, username
        FROM users
        WHERE username = ?
    """, (demo_username,)).fetchone()

    if demo_user is None:
        cursor = conn.execute("""
            INSERT INTO users (username, password_hash)
            VALUES (?, ?)
        """, (
            demo_username,
            generate_password_hash("demo")
        ))

        demo_user_id = cursor.lastrowid
    else:
        demo_user_id = demo_user["id"]

    reset_demo_data(conn, demo_user_id)

    conn.commit()
    conn.close()

    session["user_id"] = demo_user_id
    session["username"] = demo_username

    return jsonify({
        "ok": True
    })

@app.post("/api/login")
def login():
    data = request.get_json()

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({
            "error": "Missing username or password"
        }), 400
    
    conn = get_db_connection()

    user = conn.execute("""
        SELECT id, username, password_hash
        FROM users
        WHERE username = ?
    """, (username,)).fetchone()

    conn.close()

    if user is None:
        return jsonify({
            "error": "Invalid username or password"
        }), 400
    
    if not check_password_hash(user["password_hash"], password):
        return jsonify({
            "error": "invalid username or password" 
        }), 400
    
    session["user_id"] = user["id"]
    session["username"] = user["username"]

    return jsonify({
        "ok": True
    })

@app.get("/api/me")
def me():
    if "user_id" not in session:
        return jsonify({
            "loggedIn": False
        })

    return jsonify({
        "loggedIn": True,
        "user": {
            "id": session["user_id"],
            "username": session["username"]
        }
    })


@app.post("/api/logout")
def logout():
    session.clear()

    return jsonify({
        "ok": True
    })

@app.post("/jobs")
def create_job():
    data = request.get_json()
    return {
        "ok": True,
        "job": data,
    }

@app.get("/signup.html")
def signup_page():
    return render_template("signup.html")

@app.get("/profile.html")
def profile():
    return render_template("profile.html")


@app.get("/applications.html")
def applications():
    return render_template("applications.html")

@app.get("/api/applications")
@login_required
def get_applications():
    conn = get_db_connection()

    rows = conn.execute("""
        SELECT
            id,
            company,
            position,
            status,
            status_detail,
            date_applied,
            interview_date,
            interview_round,
            notes,
            archived
        FROM applications
        WHERE user_id = ? AND archived = 0
        ORDER BY created_at DESC
    """, (session["user_id"],)).fetchall()

    conn.close()

    applications = []

    for row in rows:
        applications.append(application_to_dict(row))

    return jsonify({
        "applications": applications
    })


@app.post("/api/applications")
@login_required
def create_application():
    data = request.get_json()

    company = data.get("company", "").strip()
    position = data.get("position", "").strip()
    status = data.get("status", "").strip()
    status_detail = data.get("statusDetail", "").strip()
    date_applied = data.get("dateApplied", "").strip()
    interview_date = data.get("interviewDate", "").strip()
    interview_round = data.get("interviewRound")
    notes = data.get("notes", "").strip()

    if interview_round == "":
        interview_round = None
    else:
        try:
            interview_round = int(interview_round)
        except ValueError:
            return jsonify({
                "error": "Interview round must be a number"
            }), 400

    if not company or not position or not status or not date_applied:
        return jsonify({
            "error": "Missing required application fields"
        }), 400

    conn = get_db_connection()

    cursor = conn.execute("""
        INSERT INTO applications (
            user_id,
            company,
            position,
            status,
            status_detail,
            date_applied,
            interview_date,
            interview_round,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        session["user_id"],
        company,
        position,
        status,
        status_detail,
        date_applied,
        interview_date,
        interview_round,
        notes
    ))

    new_id = cursor.lastrowid

    create_application_event(
        conn,
        new_id,
        "application_created",
        date_applied
    )

    event_type = status_to_event_type(status)

    if event_type is not None:
        create_application_event(
            conn,
            new_id,
            event_type,
            date_applied
        )

    if should_create_interview_event(status, status_detail, interview_round, interview_date):
        create_application_event(
            conn,
            new_id,
            "interview_scheduled",
            interview_date,
            interview_round
        )

    conn.commit()

    row = conn.execute("""
        SELECT
            id,
            company,
            position,
            status,
            status_detail,
            date_applied,
            interview_date,
            interview_round,
            notes,
            archived
        FROM applications
        WHERE id = ? AND user_id = ?
    """, (new_id, session["user_id"])).fetchone()

    conn.close()

    return jsonify({
        "application": application_to_dict(row)
    }), 201

@app.put("/api/applications/<int:application_id>")
@login_required
def update_application(application_id):
    data = request.get_json()

    company = data.get("company", "").strip()
    position = data.get("position", "").strip()
    status = data.get("status", "").strip()
    status_detail = data.get("statusDetail", "").strip()
    date_applied = data.get("dateApplied", "").strip()
    interview_date = data.get("interviewDate", "").strip()
    interview_round = data.get("interviewRound")
    notes = data.get("notes", "").strip()

    if interview_round == "":
        interview_round = None
    else:
        try:
            interview_round = int(interview_round)
        except ValueError:
            return jsonify({
                "error": "Interview round must be a number"
            }), 400

    if not company or not position or not status or not date_applied:
        return jsonify({
            "error": "Missing required application fields"
        }), 400

    conn = get_db_connection()

    old_row = conn.execute("""
        SELECT
            id,
            status,
            status_detail,
            interview_round,
            interview_date,
            notes
        FROM applications
        WHERE id = ? AND user_id = ?
    """, (application_id, session["user_id"])).fetchone()

    if old_row is None:
        conn.close()
        return jsonify({
            "error": "Application not found"
        }), 404

    old_interview_round = old_row["interview_round"]
    old_interview_date = old_row["interview_date"]
    old_notes = old_row["notes"] or ""

    old_interview_exists = (
        old_interview_round is not None or
        old_interview_date != ""
    )

    interview_changed = (
        old_interview_round != interview_round or
        old_interview_date != interview_date
    )

    if old_interview_exists and interview_changed:
        archived_interview_note = (
            "\n\nPast interview:\n"
            f"Round: {old_interview_round or 'N/A'}\n"
            f"Date: {old_interview_date or 'N/A'}"
        )

        if notes:
            notes = old_notes + archived_interview_note + "\n\n" + notes
        else:
            notes = old_notes + archived_interview_note

    conn.execute("""
        UPDATE applications
        SET company = ?,
            position = ?,
            status = ?,
            status_detail = ?,
            date_applied = ?,
            interview_date = ?,
            interview_round = ?,
            notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    """, (
        company,
        position,
        status,
        status_detail,
        date_applied,
        interview_date,
        interview_round,
        notes,
        application_id,
        session["user_id"]
    ))

    event_type = None

    if old_row["status"] != status:
        event_type = status_to_event_type(status)

    if event_type is not None:
        create_application_event(
            conn,
            application_id,
            event_type
        )

    new_interview_should_be_logged = should_create_interview_event(
        status,
        status_detail,
        interview_round,
        interview_date
    )

    interview_is_new_or_changed = (
        old_row["status"] != status or
        old_row["status_detail"] != status_detail or
        old_row["interview_round"] != interview_round or
        old_row["interview_date"] != interview_date
    )

    if new_interview_should_be_logged and interview_is_new_or_changed:
        create_application_event(
            conn,
            application_id,
            "interview_scheduled",
            interview_date,
            interview_round
        )

    conn.commit()

    row = conn.execute("""
        SELECT
            id,
            company,
            position,
            status,
            status_detail,
            date_applied,
            interview_date,
            interview_round,
            notes,
            archived
        FROM applications
        WHERE id = ? AND user_id = ?
    """, (application_id, session["user_id"])).fetchone()

    conn.close()

    if row is None:
        return jsonify({
            "error": "Application not found"
        }), 404

    return jsonify({
        "application": application_to_dict(row)
    })

@app.delete("/api/applications/<int:application_id>")
@login_required
def delete_application(application_id):
    conn = get_db_connection()

    cursor = conn.execute("""
        DELETE FROM applications
        WHERE id = ? AND user_id = ?
    """, (application_id, session["user_id"]))

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({
            "error": "Application not found"
        }), 404

    return jsonify({
        "ok": True
    })

@app.post("/api/applications/<int:application_id>/archive")
@login_required
def archive_application(application_id):
    conn = get_db_connection()

    cursor = conn.execute("""
        UPDATE applications
        SET archived = 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    """, (application_id, session["user_id"]))

    conn.commit()
    conn.close()

    if cursor.rowcount == 0:
        return jsonify({
            "error": "Application not found"
        }), 404

    return jsonify({
        "ok": True
    })

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
""")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            company TEXT NOT NULL,
            position TEXT NOT NULL,
            status TEXT NOT NULL,
            status_detail TEXT DEFAULT '',
            date_applied TEXT NOT NULL,
            interview_date TEXT DEFAULT '',
            interview_round INTEGER,
            notes TEXT DEFAULT '',
            archived INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS application_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            application_id INTEGER NOT NULL,
            event_type TEXT NOT NULL,
            event_date TEXT,
            interview_round INTEGER,
            notes TEXT DEFAULT '',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (application_id) REFERENCES applications(id)
        )
    """)
    conn.commit()
    conn.close()

def application_to_dict(row):
    return {
        "id": row["id"],
        "company": row["company"],
        "position": row["position"],
        "status": row["status"],
        "statusDetail": row["status_detail"],
        "dateApplied": row["date_applied"],
        "interviewDate": row["interview_date"],
        "interviewRound": row["interview_round"],
        "notes": row["notes"],
        "archived": row["archived"]
    }

def create_application_event(conn, application_id, event_type, event_date=None, interview_round=None, notes=""):
    conn.execute("""
        INSERT INTO application_events (
            user_id,
            application_id,
            event_type,
            event_date,
            interview_round,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        session["user_id"],
        application_id,
        event_type,
        event_date,
        interview_round,
        notes
    ))

def should_create_interview_event(status, status_detail, interview_round, interview_date):
    return (
        status == "Applied" and
        status_detail == "Interview Scheduled" and
        interview_round is not None and
        interview_date != ""
    )

def status_to_event_type(status):
    event_map = {
        "Applied": "application_submitted",
        "Rejected": "rejected",
        "Accepted": "offer_received"
    }

    return event_map.get(status)


init_db()

if __name__ == "__main__": 
    app.run(debug=True)

