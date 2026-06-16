from flask import Flask, send_from_directory, request, render_template, jsonify
from pathlib import Path
import sqlite3


BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
TEMPLATES_DIR = FRONTEND_DIR / "templates"
STATIC_DIR = FRONTEND_DIR / "static"
DB_NAME = "labwork.db"


app = Flask(
    __name__,
    template_folder=str(TEMPLATES_DIR),
    static_folder=str(STATIC_DIR),
    static_url_path="/static",
)

@app.get("/")
def home():
    return render_template("base.html")

@app.get("/static/<path:filename>")
def static_files(filename): return send_from_directory(FRONTEND_DIR, filename)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/jobs")
def create_job():
    data = request.get_json()
    return {
        "ok": True,
        "job": data,
    }

@app.get("/profile.html")
def profile():
    return render_template("profile.html")


@app.get("/applications.html")
def applications():
    return render_template("applications.html")

@app.get("/api/applications")
def get_applications():
    conn = get_db_connection()

    rows = conn.execute("""
        SELECT id, company, position, status, date_applied
        FROM applications
        ORDER BY created_at DESC
    """).fetchall()

    conn.close()

    applications = []

    for row in rows:
        applications.append(application_to_dict(row))

    return jsonify({
        "applications": applications
    })

@app.post("/api/applications")
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
        INSERT INTO applications (company, position, status, date_applied)
        VALUES (?, ?, ?, ?)
    """, (company, position, status, date_applied))

    conn.commit()

    new_id = cursor.lastrowid

    row = conn.execute("""
        SELECT id, company, position, status, date_applied
        FROM applications
        WHERE id = ?
    """, (new_id,)).fetchone()

    conn.close()

    return jsonify({
        "application": application_to_dict(row)
    }), 201

@app.put("/api/applications/<int:application_id>")
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
        WHERE id = ?
    """, (company, position, status, date_applied, application_id))

    conn.commit()

    row = conn.execute("""
        SELECT id, company, position, status, date_applied
        FROM applications
        WHERE id = ?
    """, (application_id,)).fetchone()

    conn.close()

    if row is None:
        return jsonify({
            "error": "Application not found"
        }), 404

    return jsonify({
        "application": application_to_dict(row)
    })
@app.delete("/api/applications/<int:application_id>")
def delete_application(application_id):
    conn = get_db_connection()

    cursor = conn.execute("""
        DELETE FROM applications
        WHERE id = ?
    """, (application_id,))

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
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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

