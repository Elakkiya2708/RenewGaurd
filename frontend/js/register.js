const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match";
        message.style.color = "red";
        return;
    }

    const user = {
        full_name: document.getElementById("full_name").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile").value,
        organization: document.getElementById("organization").value,
        department: document.getElementById("department").value,
        employee_id: document.getElementById("employee_id").value,
        password: password
    };

    try {
        const response = await fetch(
            "http://localhost:5000/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }
        );

        const data = await response.json();

        if (response.ok) {
            message.textContent = "Registration successful!";
            message.style.color = "green";

            form.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } else {
            message.textContent = data.message || "Registration failed";
            message.style.color = "red";
        }

    } catch (error) {
        message.textContent = "Unable to connect to server";
        message.style.color = "red";
        console.error(error);
    }
});