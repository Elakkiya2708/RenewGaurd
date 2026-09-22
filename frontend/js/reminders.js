const token = localStorage.getItem("token");
const response = await fetch("http://localhost:5000/api/reminders");
if (!token) {
    window.location.href = "login.html";
}

const reminderList = document.getElementById("reminderList");

async function loadReminders() {
    try {
        const response = await fetch("http://localhost:5000/api/reminders");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        if (data.length === 0) {
            reminderList.innerHTML = "<p>No reminders found.</p>";
            return;
        }

        reminderList.innerHTML = data.map(item => `
            <div class="reminder-card">
                <div>
                    <h3>${item.renewals?.name || "Renewal"}</h3>
                    <p>Reminder Date: ${item.reminder_date}</p>
                    <p>${item.reminder_days} days before expiry</p>
                </div>

                <span class="badge">${item.status}</span>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);
        reminderList.innerHTML =
            "<p>Failed to load reminders.</p>";
    }
}

loadReminders();