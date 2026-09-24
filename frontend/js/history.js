const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const historyTable = document.getElementById("historyTable");

async function loadHistory() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/history",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load history");
        }

        if (!Array.isArray(data) || data.length === 0) {
            historyTable.innerHTML = `
                <tr>
                    <td colspan="6">No history found.</td>
                </tr>
            `;
            return;
        }

        historyTable.innerHTML = data.map(item => `
            <tr>
                <td>${item.renewal_id || "-"}</td>
                <td>${item.action || "-"}</td>
                <td>${item.old_status || "-"}</td>
                <td>${item.new_status || "-"}</td>
                <td>${item.remarks || "-"}</td>
                <td>${item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "-"
                }</td>
            </tr>
        `).join("");

    } catch (error) {
        console.error("HISTORY ERROR:", error);

        historyTable.innerHTML = `
            <tr>
                <td colspan="6">Failed to load history.</td>
            </tr>
        `;
    }
}

loadHistory();