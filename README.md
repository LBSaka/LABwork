# LABwork

LABwork is a web application for tracking job applications.

This repository currently contains the first working milestone: a Flask-served Create MVP. The app serves multiple pages and lets the user create temporary job application rows in a table from the Applications page.

## Current Status

Milestone 1: Create-only MVP.

The application currently supports creating job application entries in the browser. Entries are stored only in memory while the page is open. Refreshing the page clears the table.

## Current Features

- Flask server with routes for the homepage, applications page, profile page, and health check.
- Static CSS and JavaScript served through Flask.
- Applications page with a job/application form.
- Form submission creates a new job application row in the table.
- Multiple rows can be created during the same page session.

## Current Limitations

- No database persistence yet.
- No login or user accounts yet.
- Refreshing the page clears created applications.
- Create is functional; Read, Update, and Delete are not complete yet.

## Project Structure

```text
labwork/
  backend/
    app.py
  templates/
    base.html
    applications.html
    profile.html
  static/
    styles.css
    homepage.js
  README.md
  requirements.txt
  .gitignore
```

## How to Run Locally

Create and activate a virtual environment.

On Windows PowerShell:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run the Flask app from the project root:

```bash
python backend/app.py
```

Open the app in your browser:

```text
http://127.0.0.1:5000/
```

## Test Checklist

- Visit `http://127.0.0.1:5000/` and confirm the homepage loads.
- Visit `http://127.0.0.1:5000/applications.html` and confirm the applications page loads.
- Create a job application from the form.
- Confirm the new application appears as a row in the table.
- Create multiple applications and confirm multiple rows appear.
- Refresh the page and confirm the rows disappear, since persistence is not implemented yet.

## Next Milestones

1. Add Delete for application rows.
2. Add basic Read behavior and empty-table messaging.
3. Add Update/Edit for existing rows.
4. Add backend storage for jobs.
5. Add database persistence.
6. Add user authentication.
