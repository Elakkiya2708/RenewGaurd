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
                    <td colspan="5">
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
                <td>${item.action || "-"}</td>
                <td>${item.details || "-"}</td>
                <td>
                    ${item.created_at
                        ? new Date(item.created_at).toLocaleString()
                        : "-"
                    }
                </td>
            </tr>
        `).join("");

    } catch (error) {

        console.error("AUDIT ERROR:", error);

        auditTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load audit logs.
                </td>
            </tr>
        `;
    }
}

loadAuditLogs();