const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const full_name =
        document.getElementById("full_name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirm_password").value;


    /* Password validation */

    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        message.style.color = "#EF4444";

        return;
    }


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        message.style.color = "#EF4444";

        return;
    }


    /* User data */

    const user = {

        full_name: full_name,

        email: email,

        mobile:
            document.getElementById("mobile").value.trim(),

        organization:
            document.getElementById("organization").value.trim(),

        department:
            document.getElementById("department").value.trim(),

        employee_id:
            document.getElementById("employee_id").value.trim(),

        password: password
    };


    message.textContent = "Creating account...";
    message.style.color = "#D4AF37";


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


        if (!response.ok) {

            message.textContent =
                data.message || "Registration failed.";

            message.style.color = "#EF4444";

            return;
        }


        /* Success */

        message.textContent =
            "Registration successful!";

        message.style.color = "#22C55E";


        form.reset();


        /* Redirect to Login */

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1000);


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        message.textContent =
            "Unable to connect to server.";

        message.style.color = "#EF4444";
    }

});