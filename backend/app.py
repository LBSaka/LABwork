from flask import Flask, send_from_directory, request, render_template, jsonify, session
from pathlib import Path
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import os
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

app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-this-later")@app.get("/")
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
                              """, (username, password))
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
        SELECT id, company, position, status, date_applied
        FROM applications
        WHERE user_id = ?
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
    date_applied = data.get("dateApplied", "").strip()

    if not company or not position or not status or not date_applied:
        return jsonify({
            "error": "Missing required application fields"
        }), 400

    conn = get_db_connection()

    cursor = conn.execute("""
        INSERT INTO applications (user_id, company, position, status, date_applied)
        VALUES (?, ?, ?, ?, ?)
    """, (session["user_id"], company, position, status, date_applied))

    conn.commit()

    new_id = cursor.lastrowid

    row = conn.execute("""
        SELECT id, company, position, status, date_applied
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
    date_applied = data.get("dateApplied", "").strip()

    if not company or not position or not status or not date_applied:
        return jsonify({
            "error": "Missing required application fields"
        }), 400

    conn = get_db_connection()

    conn.execute("""
        UPDATE applications
        SET company = ?,
            position = ?,
            status = ?,
            date_applied = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    """, (company, position, status, date_applied, application_id, session["user_id"]))

    conn.commit()

    row = conn.execute("""
        SELECT id, company, position, status, date_applied
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
            date_applied TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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
        "dateApplied": row["date_applied"]
    }

init_db()

if __name__ == "__main__": 
    app.run(debug=True)

