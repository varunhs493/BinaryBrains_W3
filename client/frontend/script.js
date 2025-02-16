/*document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const logoutBtn = document.getElementById("logoutBtn");

    // LOGIN
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("http://localhost:5000/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login successful!");

                // Redirect to stored page or dashboard
                const redirectPage = localStorage.getItem("redirectAfterLogin");
                if (redirectPage) {
                    localStorage.removeItem("redirectAfterLogin"); // Clear stored path
                    window.location.href = redirectPage;
                } else {
                    window.location.href = "dashboard.html"; // Default redirect
                }
            } else {
                document.getElementById("errorMessage").textContent = data.msg || "Invalid login!";
            }
        });
    }

    // SIGNUP
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const location = document.getElementById("location").value;

            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, location })
            });

            const data = await response.json();
            if (response.ok) {
                document.getElementById("signupMessage").style.color = "green";
                document.getElementById("signupMessage").textContent = "Signup successful! Redirecting...";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                document.getElementById("signupMessage").textContent = data.msg || "Signup failed!";
            }
        });
    }

    // DASHBOARD - Fetch User Info
    async function fetchUser() {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "login.html"; // Redirect if not logged in
            return;
        }

        const response = await fetch("http://localhost:5000/api/auth", {
            method: "GET",
            headers: { "Content-Type": "application/json", "x-auth-token": token }
        });

        const data = await response.json();
        if (response.ok) {
            document.getElementById("userName").textContent = data.name;
            document.getElementById("userEmail").textContent = data.email;
        } else {
            localStorage.removeItem("token");
            window.location.href = "login.html"; // Redirect on error
        }
    }

    if (window.location.pathname.includes("dashboard.html")) {
        fetchUser(); // Call function on dashboard page
    }

    // LOGOUT
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            document.getElementById("logoutMessage").textContent = "Logging out...";
            setTimeout(() => {
                window.location.href = "login.html"; // Redirect to login
            }, 1500);
        });
    }
});*/
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // ✅ Trim values to remove extra spaces
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const location = document.getElementById("location").value.trim();

        console.log("🟢 Sending Data:", { name, email, password, location }); // ✅ Debugging

        // ✅ Prevent sending empty values
        if (!name || !email || !password || !location) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, location })
            });

            const data = await response.json();
            console.log("🟢 Server Response:", data); // ✅ Debugging

            if (response.ok) {
                document.getElementById("signupMessage").style.color = "green";
                document.getElementById("signupMessage").textContent = "Signup successful! Redirecting...";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                document.getElementById("signupMessage").textContent = data.msg || "Signup failed!";
            }
        } catch (error) {
            console.error("❌ Network Error:", error);
            alert("Network error. Please try again.");
        }
    });
}

//login

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:5000/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Login successful!");

            // Redirect to stored page or dashboard
            const redirectPage = localStorage.getItem("redirectAfterLogin");
            if (redirectPage) {
                localStorage.removeItem("redirectAfterLogin"); // Clear stored path
                window.location.href = "dashboard.html";
            } else {
                window.location.href = "dashboard.html"; // Default redirect
            }
        } else {
            document.getElementById("errorMessage").textContent = data.msg || "Invalid login!";
        }
    });
}


