const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};

const reminderList = document.getElementById("reminderList");

const totalReminders = document.getElementById("totalReminders");
const pendingReminders = document.getElementById("pendingReminders");
const completedReminders = document.getElementById("completedReminders");

const resultText = document.getElementById("resultText");

let reminders = [];


/* =========================
   LOAD REMINDERS
========================= */

async function loadReminders() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/reminders",
            {
                headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load reminders"
            );
        }

        reminders = Array.isArray(data) ? data : [];

        updateSummary();

        renderReminders();

    } catch (error) {

        console.error("REMINDER ERROR:", error);

        reminderList.innerHTML = `
            <div class="empty">
                ${escapeHTML(
                    error.message || "Failed to load reminders."
                )}
            </div>
        `;

        resultText.textContent = "Error loading reminders";
    }
}


/* =========================
   SUMMARY
========================= */

function updateSummary() {

    const total = reminders.length;

    const pending = reminders.filter(
        item => item.status === "Pending"
    ).length;

    const completed = reminders.filter(
        item => item.status === "Completed"
    ).length;

    totalReminders.textContent = total;

    pendingReminders.textContent = pending;

    completedReminders.textContent = completed;
}


/* =========================
   RENDER REMINDERS
========================= */

function renderReminders() {

    if (reminders.length === 0) {

        reminderList.innerHTML = `
            <div class="empty">
                No reminders found.
            </div>
        `;

        resultText.textContent = "No reminders found";

        return;
    }

    resultText.textContent =
        `${reminders.length} reminder${
            reminders.length !== 1 ? "s" : ""
        } found`;

    reminderList.innerHTML = reminders.map(item => {

        const statusClass =
            String(item.status || "")
                .toLowerCase();

        return `
            <div class="reminder-card">

                <div class="reminder-info">

                    <h3>
                        ${escapeHTML(
                            item.renewals?.name || "Renewal"
                        )}
                    </h3>

                    <p>
                        <strong>Reminder Date:</strong>
                        ${formatDate(item.reminder_date)}
                    </p>

                    <p>
                        <strong>Reminder:</strong>
                        ${escapeHTML(
                            item.reminder_days || "-"
                        )}
                        days before expiry
                    </p>

                    <p>
                        <strong>Expiry Date:</strong>
                        ${formatDate(
                            item.renewals?.expiry_date
                        )}
                    </p>

                </div>


                <div class="reminder-actions">

                    <span class="badge ${statusClass}">
                        ${escapeHTML(
                            item.status || "-"
                        )}
                    </span>

                    ${
                        item.status === "Pending"
                        ?
                        `
                            <button
                                class="complete-btn"
                                onclick="completeReminder(${item.id})">
                                Complete
                            </button>
                        `
                        :
                        ""
                    }

                </div>

            </div>
        `;

    }).join("");
}


/* =========================
   COMPLETE REMINDER
========================= */

async function completeReminder(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/reminders/${id}`,
            {
                method: "PUT",
                headers,
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

        await loadReminders();

    } catch (error) {

        console.error(
            "UPDATE REMINDER ERROR:",
            error
        );

        alert(
            error.message ||
            "Failed to update reminder"
        );
    }
}


/* =========================
   USER INFO
========================= */

const user = JSON.parse(
    localStorage.getItem("user")
);

if (user) {

    document.getElementById("userName").textContent =
        user.name || "User";

    document.getElementById("userRole").textContent =
        user.role || "Employee";

    document.getElementById("userAvatar").textContent =
        (user.name || "U")
            .charAt(0)
            .toUpperCase();

    if (user.role !== "Admin") {

        document.getElementById("usersLink")
            .style.display = "none";

        document.getElementById("auditLink")
            .style.display = "none";
    }
}


/* =========================
   LOGOUT
========================= */

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "login.html";
    });


/* =========================
   THEME
========================= */

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    themeToggle.textContent = "🌙";
}

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-theme"
    );

    const isLight =
        document.body.classList.contains(
            "light-theme"
        );

    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );

    themeToggle.textContent =
        isLight ? "🌙" : "☀️";
});


/* =========================
   HELPERS
========================= */

function formatDate(date) {

    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   START
========================= */

loadReminders();