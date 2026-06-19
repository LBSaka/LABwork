const profileUsername = document.getElementById("profileUsername");
const settingsForm = document.getElementById("settingsForm");
const languageSetting = document.getElementById("languageSetting");
const themeSetting = document.getElementById("themeSetting");
const deleteAccountButton = document.getElementById("deleteAccountButton");

function t(key) {
    if (window.LABWORK && typeof window.LABWORK.t === "function") {
        return window.LABWORK.t(key);
    }

    return key;
}

function syncSettingsForm() {
    if (languageSetting && window.LABWORK) {
        languageSetting.value = window.LABWORK.getLanguage();
    }

    if (themeSetting && window.LABWORK) {
        themeSetting.value = window.LABWORK.getTheme();
    }
}

async function loadProfilePage() {
    const res = await fetch("/api/me");
    const data = await res.json();

    if (!data.loggedIn) {
        window.location.href = "/";
        return;
    }

    if (profileUsername) {
        profileUsername.textContent = data.user.username;
    }

    syncSettingsForm();
}

if (settingsForm) {
    settingsForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (window.LABWORK) {
            window.LABWORK.setLanguage(languageSetting.value);
            window.LABWORK.setTheme(themeSetting.value);
        } else {
            localStorage.setItem("labworkLanguage", languageSetting.value);
            localStorage.setItem("labworkTheme", themeSetting.value);
        }

        syncSettingsForm();
        alert(t("settingsSaved"));
    });
}

if (languageSetting) {
    languageSetting.addEventListener("change", function () {
        if (window.LABWORK) {
            window.LABWORK.setLanguage(languageSetting.value);
        }
    });
}

if (themeSetting) {
    themeSetting.addEventListener("change", function () {
        if (window.LABWORK) {
            window.LABWORK.setTheme(themeSetting.value);
        }
    });
}

if (deleteAccountButton) {
    deleteAccountButton.addEventListener("click", function () {
        alert(t("deleteAccountNext"));
    });
}

document.addEventListener("labwork:languagechange", syncSettingsForm);
document.addEventListener("labwork:themechange", syncSettingsForm);

loadProfilePage();
