const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const demoLoginButton = document.getElementById("demoLoginButton");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: document.getElementById("loginUsername").value.trim(),
                password: document.getElementById("loginPassword").value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Login failed");
            return;
        }

        window.location.href = "/applications.html";
    });
}

if (signupForm) {
    signupForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: document.getElementById("signupUsername").value.trim(),
                password: document.getElementById("signupPassword").value
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Signup failed");
            return;
        }

        window.location.href = "/applications.html";
    });
}
if (demoLoginButton) {
    demoLoginButton.addEventListener("click", async function() {
        const res = await fetch("/api/demo-login", {
            method: "POST"
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Demo login failed");
            return;
        }

        window.location.href = "/applications.html";
    });
}