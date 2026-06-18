const profileUsername = document.getElementById("profileUsername");
const settingsForm = document.getElementById("settingsForm");
const languageSetting = document.getElementById("languageSetting");
const themeSetting = document.getElementById("themeSetting");
const deleteAccountButton = document.getElementById("deleteAccountButton");

async function loadProfilePage() {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!data.loggedIn) {
        window.location.href = "/";
        return;
    }

    profileUsername.textContent = data.user.username;

    const savedLanguage = localStorage.getItem("labworkLanguage");
    const savedTheme = localStorage.getItem("labworkTheme");

    if (savedLanguage) {
        languageSetting.value = savedLanguage;
    }

    if (savedTheme) {
        themeSetting.value = savedTheme;
    }
}

settingsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    localStorage.setItem("labworkLanguage", languageSetting.value);
    localStorage.setItem("labworkTheme", themeSetting.value);

    alert("Settings saved locally for now.");
});

deleteAccountButton.addEventListener("click", function() {
    alert("Delete account backend is next.");
});

loadProfilePage();