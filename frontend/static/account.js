const currentUserDisplay = document.getElementById("currentUserDisplay");
const logoutButton = document.getElementById("logoutButton");

async function loadCurrentUser() {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!data.loggedIn) {
        if (currentUserDisplay) {
            currentUserDisplay.textContent = "Not signed in";
        }

        return;
    }

    if (currentUserDisplay) {
        currentUserDisplay.textContent = "Signed in as " + data.user.username;
    }
}

if (logoutButton) {
    logoutButton.addEventListener("click", async function() {
        const res = await fetch("/api/logout", {
            method: "POST"
        });

        if (!res.ok) {
            alert("Logout failed");
            return;
        }

        window.location.href = "/";
    });
}

loadCurrentUser();