DEMO_APPLICATIONS = [
    {
        "company": "Florida Jit LLC",
        "position": "Jit Engineer",
        "status": "NYA",
        "status_detail": "",
        "date_applied": "2026-06-18",
        "interview_date": "",
        "interview_round": None,
        "notes": "John LABwork is still tailoring his resume. Role appears to require advanced jit fluency.",
        "archived": 0,
        "events": [
            ("application_created", "2026-06-18", None, "Demo application created.")
        ]
    },
    {
        "company": "Ilum Industries",
        "position": "Radar Technician",
        "status": "Applied",
        "status_detail": "Interview Scheduled",
        "date_applied": "2026-06-14",
        "interview_date": "2026-06-21",
        "interview_round": 1,
        "notes": "First interview scheduled. John is preparing to explain radar-adjacent backend systems.",
        "archived": 0,
        "events": [
            ("application_created", "2026-06-14", None, "Demo application created."),
            ("application_submitted", "2026-06-14", None, "Application submitted."),
            ("interview_scheduled", "2026-06-21", 1, "First interview scheduled.")
        ]
    },
    {
        "company": "Atlantis Aqueduct Systems",
        "position": "Infrastructure Engineer",
        "status": "Applied",
        "status_detail": "Interview Scheduled",
        "date_applied": "2026-06-08",
        "interview_date": "2026-06-24",
        "interview_round": 2,
        "notes": "Past interview:\nRound: 1\nDate: 2026-06-16\n\nSecond interview scheduled with infrastructure team.",
        "archived": 0,
        "events": [
            ("application_created", "2026-06-08", None, "Demo application created."),
            ("application_submitted", "2026-06-08", None, "Application submitted."),
            ("interview_scheduled", "2026-06-16", 1, "First interview scheduled."),
            ("interview_scheduled", "2026-06-24", 2, "Second interview scheduled.")
        ]
    },
    {
        "company": "North Pole Productions",
        "position": "Present Engineer",
        "status": "Accepted",
        "status_detail": "",
        "date_applied": "2026-06-01",
        "interview_date": "",
        "interview_round": None,
        "notes": "Offer received after final interview. Strong culture fit. Seasonal deployment pipeline discussed.",
        "archived": 0,
        "events": [
            ("application_created", "2026-06-01", None, "Demo application created."),
            ("application_submitted", "2026-06-01", None, "Application submitted."),
            ("interview_scheduled", "2026-06-07", 1, "First interview scheduled."),
            ("interview_scheduled", "2026-06-12", 2, "Second interview scheduled."),
            ("interview_scheduled", "2026-06-15", 3, "Final interview scheduled."),
            ("offer_received", "2026-06-16", None, "Offer received.")
        ]
    },
    {
        "company": "South Pole Productions",
        "position": "Penguin Engineer",
        "status": "Rejected",
        "status_detail": "",
        "date_applied": "2026-06-03",
        "interview_date": "",
        "interview_round": None,
        "notes": "Rejected after screening. Penguin systems team moved forward with another candidate.",
        "archived": 0,
        "events": [
            ("application_created", "2026-06-03", None, "Demo application created."),
            ("application_submitted", "2026-06-03", None, "Application submitted."),
            ("rejected", "2026-06-09", None, "Rejected after screening.")
        ]
    }
]


def reset_demo_data(conn, demo_user_id):
    conn.execute("""
        DELETE FROM application_events
        WHERE user_id = ?
    """, (demo_user_id,))

    conn.execute("""
        DELETE FROM applications
        WHERE user_id = ?
    """, (demo_user_id,))

    for demo_app in DEMO_APPLICATIONS:
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
                notes,
                archived
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            demo_user_id,
            demo_app["company"],
            demo_app["position"],
            demo_app["status"],
            demo_app["status_detail"],
            demo_app["date_applied"],
            demo_app["interview_date"],
            demo_app["interview_round"],
            demo_app["notes"],
            demo_app.get("archived", 0)
        ))

        application_id = cursor.lastrowid

        for event_type, event_date, interview_round, event_notes in demo_app["events"]:
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
                demo_user_id,
                application_id,
                event_type,
                event_date,
                interview_round,
                event_notes
            ))