const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;


    /* Basic validation */

    if (!email || !password) {
        message.textContent = "Please enter email and password.";
        message.style.color = "#EF4444";
        return;
    }


    message.textContent = "Logging in...";
    message.style.color = "#D4AF37";


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                data.message || "Invalid email or password.";

            message.style.color = "#EF4444";

            return;
        }


        /* Save login details */

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );


        message.textContent =
            "Login successful!";

        message.style.color =
            "#22C55E";


        /* Go to dashboard */

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 600);


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        message.textContent =
            "Server connection failed.";

        message.style.color =
            "#EF4444";
    }

});