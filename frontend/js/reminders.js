const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const reminderList = document.getElementById("reminderList");

async function loadReminders() {
    try {
        const response = await fetch("http://localhost:5000/api/reminders");

        console.log("STATUS:", response.status);

        const text = await response.text();

        console.log("API RESPONSE:", text);

        const data = JSON.parse(text);

        reminderList.innerHTML = data.map(item => `
            <div class="reminder-card">
                <div>
                    <h3>${item.renewals?.name || "Renewal"}</h3>
                    <p>Reminder Date: ${item.reminder_date}</p>
                    <p>${item.reminder_days} days before expiry</p>
                    <p>Expiry Date: ${item.renewals?.expiry_date || "-"}</p>
                </div>
                <span class="badge">${item.status}</span>

${item.status === "Pending" ? `
    <button onclick="completeReminder(${item.id})">
        Complete
    </button>
` : ""}
            </div>
        `).join("");

    } catch (error) {
        console.error("REMINDER ERROR:", error);
        reminderList.innerHTML = "<p>Failed to load reminders.</p>";
    }
}

loadReminders();