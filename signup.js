document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        alert(data.message);
        window.location.href = "login.html"; // Redirect to login after signup
    } catch (error) {
        console.error("Error signing up:", error);
    }
});
