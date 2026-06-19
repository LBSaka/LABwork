(function () {
    const LANGUAGE_KEY = "labworkLanguage";
    const THEME_KEY = "labworkTheme";

    const translations = {
        en: {
            landing: "Landing",
            applications: "Applications",
            profileSettings: "Profile / Settings",
            myApplications: "My Applications",
            profile: "Profile",
            progressTracker: "SUSUME Progress Tracker",

            signIn: "Sign In",
            username: "Username",
            password: "Password",
            tryDemo: "Try Demo as John LABwork",
            noAccount: "No account yet?",
            createOne: "Create one",
            workInProgress: "MVP Demo — Core application tracking features are live.",
            checkingLogin: "Checking login...",
            notSignedIn: "Not signed in",
            signedInAs: "Signed in as",
            logout: "Logout",
            logoutFailed: "Logout failed",

            searchPlaceholder: "Search by company or position",
            allStatuses: "All Statuses",
            company: "Company",
            position: "Position",
            status: "Status",
            dateApplied: "Date Applied",

            newApplication: "New Application",
            companyName: "Company Name",
            statusDetail: "Status Detail",
            interviewRound: "Interview Round",
            interviewDate: "Interview Date",
            notes: "Notes",
            saveJob: "Save Job",
            cancel: "Cancel",

            notYetApplied: "Not Yet Applied",
            applied: "Applied",
            rejected: "Rejected",
            accepted: "Accepted",

            none: "None",
            awaitingReply: "Awaiting Reply",
            followUpNeeded: "Follow-up Needed",
            interviewScheduled: "Interview Scheduled",

            edit: "Edit",
            delete: "Delete",
            archive: "Archive",
            archiveConfirm: "Archive this application?",

            darkMode: "Dark",
            lightMode: "Light",
            japaneseMode: "日本語",
            englishMode: "English",

            account: "Account",
            settings: "Settings",
            language: "Language",
            theme: "Theme",
            loading: "Loading...",
            saveSettings: "Save Settings",
            settingsSaved: "Settings saved.",
            dangerZone: "Danger Zone",
            deleteAccountWarning: "Delete your account and all saved applications. This will be permanent.",
            deleteAccount: "Delete Account",
            deleteAccountNext: "Delete account backend is next.",

            landingEyebrow: "Job hunting, organized.",
            landingSubtitle: "Track applications, interviews, notes, and progress in one clean workspace.",
            openApplications: "Open Applications",
            whyLabwork: "Why LABwork?",
            featureTrack: "Track every company and role you apply to.",
            featureInterviews: "Save interview dates, rounds, and notes.",
            featureProgress: "See your job search progress clearly.",

            applicationsSubtitle: "Track every opportunity from first lead to final result.",
            search: "Search",
            applicationEntry: "Application Entry",
            companyPlaceholder: "LABwork Incorporated",
            positionPlaceholder: "Radar Technician",
            notesPlaceholder: "Recruiter notes, interview thoughts, next steps...",

            settingsCenter: "Settings Center",
            settingsSubtitle: "Manage your account, display preferences, and LABwork workspace settings.",
            workspacePreferences: "Workspace Preferences",

            loginFailed: "Login failed",
            signupFailed: "Signup failed",
            demoLoginFailed: "Demo login failed",
            failedToLoadApplications: "Failed to load applications",
            failedToCreateApplication: "Failed to create application",
            failedToUpdateApplication: "Failed to update application",
            failedToArchiveApplication: "Failed to archive application",
            failedToDeleteApplication: "Failed to delete application"
        },

        ja: {
            landing: "トップ",
            applications: "応募一覧",
            profileSettings: "プロフィール / 設定",
            myApplications: "応募管理",
            profile: "プロフィール",
            progressTracker: "進捗トラッカー",

            signIn: "ログイン",
            username: "ユーザー名",
            password: "パスワード",
            tryDemo: "John LABworkでデモを試す",
            noAccount: "アカウントをお持ちでない方",
            createOne: "新規作成",
            workInProgress: "MVPデモ — 応募管理の主要機能が利用できます。",
            checkingLogin: "ログイン状態を確認中...",
            notSignedIn: "未ログイン",
            signedInAs: "ログイン中",
            logout: "ログアウト",
            logoutFailed: "ログアウトに失敗しました",

            searchPlaceholder: "会社名または職種で検索",
            allStatuses: "すべてのステータス",
            company: "会社名",
            position: "職種",
            status: "ステータス",
            dateApplied: "応募日",

            newApplication: "新しい応募",
            companyName: "会社名",
            statusDetail: "ステータス詳細",
            interviewRound: "面接回数",
            interviewDate: "面接日",
            notes: "メモ",
            saveJob: "保存",
            cancel: "キャンセル",

            notYetApplied: "未応募",
            applied: "応募済み",
            rejected: "不採用",
            accepted: "内定",

            none: "なし",
            awaitingReply: "返信待ち",
            followUpNeeded: "要フォローアップ",
            interviewScheduled: "面接予定",

            edit: "編集",
            delete: "削除",
            archive: "アーカイブ",
            archiveConfirm: "この応募をアーカイブしますか？",

            darkMode: "ダーク",
            lightMode: "ライト",
            japaneseMode: "日本語",
            englishMode: "English",

            account: "アカウント",
            settings: "設定",
            language: "言語",
            theme: "テーマ",
            loading: "読み込み中...",
            saveSettings: "設定を保存",
            settingsSaved: "設定を保存しました。",
            dangerZone: "危険な操作",
            deleteAccountWarning: "アカウントと保存された応募データをすべて削除します。この操作は元に戻せません。",
            deleteAccount: "アカウントを削除",
            deleteAccountNext: "アカウント削除機能のバックエンドは次に実装予定です。",

            landingEyebrow: "就活を、わかりやすく整理。",
            landingSubtitle: "応募、面接、メモ、進捗をひとつのワークスペースで管理できます。",
            openApplications: "応募一覧を開く",
            whyLabwork: "LABworkでできること",
            featureTrack: "応募した会社と職種を管理できます。",
            featureInterviews: "面接日、面接回数、メモを保存できます。",
            featureProgress: "就活の進捗を見やすく確認できます。",

            applicationsSubtitle: "気になる企業から最終結果まで、応募状況をまとめて管理できます。",
            search: "検索",
            applicationEntry: "応募情報",
            companyPlaceholder: "大阪ラボ株式会社",
            positionPlaceholder: "ソフトウェアエンジニア",
            notesPlaceholder: "面接メモ、担当者メモ、次にやることなど...",

            settingsCenter: "設定センター",
            settingsSubtitle: "アカウント、表示設定、LABworkのワークスペース設定を管理できます。",
            workspacePreferences: "ワークスペース設定",

            loginFailed: "ログインに失敗しました",
            signupFailed: "新規登録に失敗しました",
            demoLoginFailed: "デモログインに失敗しました",
            failedToLoadApplications: "応募データの読み込みに失敗しました",
            failedToCreateApplication: "応募データの作成に失敗しました",
            failedToUpdateApplication: "応募データの更新に失敗しました",
            failedToArchiveApplication: "応募データのアーカイブに失敗しました",
            failedToDeleteApplication: "応募データの削除に失敗しました"
        }
    };

    function normalizeLanguage(language) {
        return language === "ja" ? "ja" : "en";
    }

    function normalizeTheme(theme) {
        return theme === "dark" ? "dark" : "light";
    }

    function getLanguage() {
        return normalizeLanguage(localStorage.getItem(LANGUAGE_KEY));
    }

    function getTheme() {
        return normalizeTheme(localStorage.getItem(THEME_KEY));
    }

    function t(key) {
        const language = getLanguage();
        const dictionary = translations[language] || translations.en;

        return dictionary[key] || translations.en[key] || key;
    }

    function setLanguage(language) {
        localStorage.setItem(LANGUAGE_KEY, normalizeLanguage(language));
        applyLanguage();
        document.dispatchEvent(new CustomEvent("labwork:languagechange"));
    }

    function setTheme(theme) {
        localStorage.setItem(THEME_KEY, normalizeTheme(theme));
        applyTheme();
        document.dispatchEvent(new CustomEvent("labwork:themechange"));
    }

    function applyTheme() {
        document.documentElement.dataset.theme = getTheme();
        updateSettingsButtons();
    }

    function applyLanguage() {
        const language = getLanguage();

        document.documentElement.lang = language === "ja" ? "ja" : "en";

        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            element.textContent = t(element.dataset.i18n);
        });

        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        });

        document.querySelectorAll("[data-i18n-title]").forEach(function (element) {
            element.title = t(element.dataset.i18nTitle);
        });

        updateSettingsButtons();
    }

    function updateSettingsButtons() {
        const languageToggle = document.getElementById("languageToggle");
        const themeToggle = document.getElementById("themeToggle");

        if (languageToggle) {
            languageToggle.textContent = getLanguage() === "en" ? t("japaneseMode") : t("englishMode");
        }

        if (themeToggle) {
            themeToggle.textContent = getTheme() === "light" ? t("darkMode") : t("lightMode");
        }
    }

    function setupSettingsButtons() {
        const languageToggle = document.getElementById("languageToggle");
        const themeToggle = document.getElementById("themeToggle");

        if (languageToggle) {
            languageToggle.addEventListener("click", function () {
                const nextLanguage = getLanguage() === "en" ? "ja" : "en";
                setLanguage(nextLanguage);
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener("click", function () {
                const nextTheme = getTheme() === "light" ? "dark" : "light";
                setTheme(nextTheme);
            });
        }
    }

    function statusLabel(status) {
        const statusKeys = {
            "NYA": "notYetApplied",
            "Not Yet Applied": "notYetApplied",
            "Applied": "applied",
            "Rejected": "rejected",
            "Accepted": "accepted"
        };

        return t(statusKeys[status] || status);
    }

    function detailLabel(detail) {
        const detailKeys = {
            "": "none",
            "None": "none",
            "Awaiting Reply": "awaitingReply",
            "Follow-up Needed": "followUpNeeded",
            "Interview Scheduled": "interviewScheduled"
        };

        return t(detailKeys[detail] || detail);
    }

    window.LABWORK = {
        t,
        getLanguage,
        getTheme,
        setLanguage,
        setTheme,
        applyLanguage,
        applyTheme,
        statusLabel,
        detailLabel
    };

    applyTheme();

    document.addEventListener("DOMContentLoaded", function () {
        setupSettingsButtons();
        applyLanguage();
        applyTheme();
    });
})();
