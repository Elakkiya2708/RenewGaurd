const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const reminderList =
    document.getElementById("reminderList");

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};


// Load Reminders
async function loadReminders() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/reminders",
            {
                headers: headers
            }
        );

        console.log("STATUS:", response.status);

        const data = await response.json();

        console.log("API RESPONSE:", data);

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load reminders"
            );
        }

        if (!Array.isArray(data) || data.length === 0) {

            reminderList.innerHTML =
                "<p>No reminders found.</p>";

            return;
        }

        reminderList.innerHTML = data.map(item => `

            <div class="reminder-card">

                <div>

                    <h3>
                        ${item.renewals?.name || "Renewal"}
                    </h3>

                    <p>
                        Reminder Date:
                        ${item.reminder_date}
                    </p>

                    <p>
                        ${item.reminder_days || "-"}
                        days before expiry
                    </p>

                    <p>
                        Expiry Date:
                        ${item.renewals?.expiry_date || "-"}
                    </p>

                </div>

                <span class="badge">
                    ${item.status}
                </span>

                ${
                    item.status === "Pending"
                    ? `
                        <button
                            onclick="completeReminder(${item.id})">
                            Complete
                        </button>
                    `
                    : ""
                }

            </div>

        `).join("");

    } catch (error) {

        console.error(
            "REMINDER ERROR:",
            error
        );

        reminderList.innerHTML =
            `<p>${error.message || "Failed to load reminders."}</p>`;
    }
}


// Complete Reminder
async function completeReminder(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/reminders/${id}`,
            {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({
                    status: "Completed"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update reminder"
            );
        }

        loadReminders();

    } catch (error) {

        console.error(
            "Update Error:",
            error
        );

        alert(
            error.message ||
            "Failed to update reminder"
        );
    }
}


// Start
loadReminders();