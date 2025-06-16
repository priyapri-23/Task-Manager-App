document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem("authToken", data.token);
            alert("Login successful!");
            window.location.href = "dashboard.html"; // Redirect to to-do list
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
});
