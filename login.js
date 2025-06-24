document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        window.showLoginMessage("Please fill in all fields.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        window.showLoginMessage("Please enter a valid email address.");
        return;
    }

    const submitBtn = document.querySelector("#loginForm button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userId", data.userId);
            window.showLoginMessage("Login successful!", "green");
            setTimeout(() => window.location.href = "dashboard.html", 1000);
        } else {
            window.showLoginMessage(data.message || "Login failed.");
        }
    } catch (error) {
        window.showLoginMessage("Error logging in. Please try again later.");
        console.error("Error logging in:", error);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});
