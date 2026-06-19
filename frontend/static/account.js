const currentUserDisplay = document.getElementById("currentUserDisplay");
const logoutButton = document.getElementById("logoutButton");

let currentUsername = "";

function t(key) {
    if (window.LABWORK && typeof window.LABWORK.t === "function") {
        return window.LABWORK.t(key);
    }

    return key;
}

function renderCurrentUser() {
    if (!currentUserDisplay) {
        return;
    }

    if (!currentUsername) {
        currentUserDisplay.textContent = t("notSignedIn");
        return;
    }

    currentUserDisplay.textContent = t("signedInAs") + " " + currentUsername;
}

async function loadCurrentUser() {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!data.loggedIn) {
        currentUsername = "";
        renderCurrentUser();
        return;
    }

    currentUsername = data.user.username;
    renderCurrentUser();
}

if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
        const res = await fetch("/api/logout", {
            method: "POST"
        });

        if (!res.ok) {
            alert(t("logoutFailed"));
            return;
        }

        window.location.href = "/";
    });
}

document.addEventListener("labwork:languagechange", renderCurrentUser);

loadCurrentUser();
