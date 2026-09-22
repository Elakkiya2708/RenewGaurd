const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const form = document.getElementById("renewalForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const renewal = {
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        organization: document.getElementById("organization").value,
        start_date: document.getElementById("start_date").value,
        expiry_date: document.getElementById("expiry_date").value,
        cost: document.getElementById("cost").value || 0,
        priority: document.getElementById("priority").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value
    };

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(renewal)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            message.textContent = data.message;
            message.style.color = "#f87171";
            return;
        }

        message.textContent = "Renewal added successfully!";
        message.style.color = "#4ade80";

        form.reset();

        setTimeout(() => {
            window.location.href = "renewals.html";
        }, 1000);

    } catch (error) {

        message.textContent = "Unable to connect to server";
        message.style.color = "#f87171";

    }
});


document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.clear();

    window.location.href = "login.html";

});