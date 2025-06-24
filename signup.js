document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
        window.showSignupMessage("Please fill in all fields.");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        window.showSignupMessage("Please enter a valid email address.");
        return;
    }

    const submitBtn = document.querySelector("#signupForm button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        window.showSignupMessage(data.message, response.ok ? "green" : "red");
        if (response.ok) {
            setTimeout(() => window.location.href = "login.html", 1000);
        }
    } catch (error) {
        window.showSignupMessage("Signup failed. Please try again later.");
        console.error("Error signing up:", error);
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
});
