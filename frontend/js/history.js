const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const historyTable = document.getElementById("historyTable");

const searchInput = document.getElementById("searchInput");
const actionFilter = document.getElementById("actionFilter");
const statusFilter = document.getElementById("statusFilter");
const resetFilters = document.getElementById("resetFilters");

const totalHistory = document.getElementById("totalHistory");
const statusChanges = document.getElementById("statusChanges");
const renewedCount = document.getElementById("renewedCount");
const expiredCount = document.getElementById("expiredCount");

const resultText = document.getElementById("resultText");

let historyData = [];


/* LOAD HISTORY */

async function loadHistory() {

    try {

        historyTable.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    Loading history...
                </td>
            </tr>
        `;

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
            throw new Error(
                data.message || "Failed to load history"
            );
        }

        historyData = Array.isArray(data) ? data : [];

        updateSummary();
        applyFilters();

    } catch (error) {

        console.error("HISTORY ERROR:", error);

        historyTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Unable to load history
                </td>
            </tr>
        `;

        resultText.textContent =
            "Error loading records";
    }
}


/* SUMMARY */

function updateSummary() {

    totalHistory.textContent =
        historyData.length;

    statusChanges.textContent =
        historyData.filter(item =>
            item.old_status &&
            item.new_status
        ).length;

    renewedCount.textContent =
        historyData.filter(item =>
            item.new_status === "Renewed"
        ).length;

    expiredCount.textContent =
        historyData.filter(item =>
            item.new_status === "Expired"
        ).length;
}


/* FILTER */

function applyFilters() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const action =
        actionFilter.value;

    const status =
        statusFilter.value;


    const filtered =
        historyData.filter(item => {

            const matchesSearch =
                !search ||
                String(item.renewal_id || "")
                    .toLowerCase()
                    .includes(search) ||
                String(item.remarks || "")
                    .toLowerCase()
                    .includes(search);

            const matchesAction =
                !action ||
                item.action === action;

            const matchesStatus =
                !status ||
                item.new_status === status;

            return (
                matchesSearch &&
                matchesAction &&
                matchesStatus
            );
        });


    renderHistory(filtered);
}


/* RENDER HISTORY */

function renderHistory(data) {

    historyTable.innerHTML = "";

    resultText.textContent =
        `${data.length} activit${data.length !== 1 ? "ies" : "y"} found`;


    if (data.length === 0) {

        historyTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty">

                    <strong>No history found</strong>

                    Try changing your search or filters.

                </td>
            </tr>
        `;

        return;
    }


    data.forEach(item => {

        const row =
            document.createElement("tr");


        const oldStatus =
            item.old_status || "-";

        const newStatus =
            item.new_status || "-";


        row.innerHTML = `

            <td class="id-cell">
                #${escapeHTML(item.renewal_id || "-")}
            </td>


            <td>

                <span class="action-badge">
                    ${escapeHTML(item.action || "-")}
                </span>

            </td>


            <td>
                ${createStatusBadge(oldStatus)}
            </td>


            <td>
                ${createStatusBadge(newStatus)}
            </td>


            <td class="remarks-cell">
                ${escapeHTML(item.remarks || "-")}
            </td>


            <td class="date-cell">
                ${formatDate(item.created_at)}
            </td>

        `;

        historyTable.appendChild(row);

    });
}


/* STATUS BADGE */

function createStatusBadge(status) {

    if (status === "-") {
        return `<span class="status neutral">-</span>`;
    }


    const className =
        getStatusClass(status);


    return `
        <span class="status ${className}">
            ${escapeHTML(status)}
        </span>
    `;
}


/* STATUS CLASS */

function getStatusClass(status) {

    if (status === "Pending")
        return "pending";

    if (status === "In Progress")
        return "in-progress";

    if (status === "Renewed")
        return "renewed";

    if (status === "Expired")
        return "expired";

    return "neutral";
}


/* DATE */

function formatDate(date) {

    if (!date) return "-";

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* SEARCH */

searchInput.addEventListener(
    "input",
    applyFilters
);


/* ACTION FILTER */

actionFilter.addEventListener(
    "change",
    applyFilters
);


/* STATUS FILTER */

statusFilter.addEventListener(
    "change",
    applyFilters
);


/* RESET */

resetFilters.addEventListener(
    "click",
    () => {

        searchInput.value = "";
        actionFilter.value = "";
        statusFilter.value = "";

        applyFilters();

    }
);


/* HTML SAFETY */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* START */

loadHistory();