const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const user = JSON.parse(localStorage.getItem("user"));

if (!user || user.role !== "Admin") {
    window.location.href = "dashboard.html";
}

const auditTable = document.getElementById("auditTable");

async function loadAuditLogs() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/audit",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load audit logs"
            );
        }

        if (!Array.isArray(data) || data.length === 0) {

            auditTable.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        No audit logs found.
                    </td>
                </tr>
            `;

            return;
        }

        auditTable.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>

                <td>${item.user_id || "-"}</td>

                <td>
                    <span class="action-badge">
                        ${escapeHTML(item.action || "-")}
                    </span>
                </td>

                <td>${escapeHTML(item.details || "-")}</td>

                <td>
                    ${item.created_at
                        ? formatDate(item.created_at)
                        : "-"
                    }
                </td>
            </tr>
        `).join("");

    } catch (error) {

        console.error("AUDIT ERROR:", error);

        auditTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    Failed to load audit logs.
                </td>
            </tr>
        `;
    }
}


function formatDate(date) {

    return new Date(date).toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* USER INFO */

if (user) {

    document.getElementById("userName").textContent =
        user.name || "User";

    document.getElementById("userRole").textContent =
        user.role || "Admin";

    document.getElementById("userAvatar").textContent =
        (user.name || "U").charAt(0).toUpperCase();
}


/* LOGOUT */

document.getElementById("logoutBtn").addEventListener(
    "click",
    () => {

        localStorage.clear();

        window.location.href = "login.html";
    }
);


/* THEME */

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    themeToggle.textContent = "🌙";
}


themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const isLight =
        document.body.classList.contains("light-theme");

    localStorage.setItem(
        "theme",
        isLight ? "light" : "dark"
    );

    themeToggle.textContent =
        isLight ? "🌙" : "☀️";
});


loadAuditLogs();