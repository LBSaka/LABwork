from flask import Flask, send_from_directory, request, render_template
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"
TEMPLATES_DIR = FRONTEND_DIR / "templates"
STATIC_DIR = FRONTEND_DIR / "static"


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


if __name__ == "__main__": 
    app.run(debug=True)

