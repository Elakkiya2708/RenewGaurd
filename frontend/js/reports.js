const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    "Authorization": `Bearer ${token}`
};

let renewals = [];

const reportTable = document.getElementById("reportTable");
const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");
const priorityFilter = document.getElementById("priorityFilter");
const searchInput = document.getElementById("searchInput");

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");
const expiredCount = document.getElementById("expiredCount");
const totalCost = document.getElementById("totalCost");
const resultText = document.getElementById("resultText");

async function loadReports() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/renewals",
            { headers }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load reports");
        }

        renewals = Array.isArray(data) ? data : [];

        updateSummary();
        applyFilters();

    } catch (error) {
        console.error("REPORT ERROR:", error);

        reportTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Unable to load reports
                </td>
            </tr>
        `;

        resultText.textContent = "Error loading reports";
    }
}

function updateSummary() {

    totalCount.textContent = renewals.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = renewals.filter(item => {
        if (!item.expiry_date) return false;

        const expiry = new Date(item.expiry_date);
        const diff = Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
        );

        return diff >= 0 && diff <= 30;
    });

    const expired = renewals.filter(item => {
        if (!item.expiry_date) return false;

        return new Date(item.expiry_date) < today;
    });

    const cost = renewals.reduce(
        (sum, item) => sum + Number(item.cost || 0),
        0
    );

    upcomingCount.textContent = upcoming.length;
    expiredCount.textContent = expired.length;

    totalCost.textContent =
        "₹" + cost.toLocaleString("en-IN");
}

function applyFilters() {

    const status = statusFilter.value;
    const category = categoryFilter.value;
    const priority = priorityFilter.value;
    const search = searchInput.value.trim().toLowerCase();

    const filtered = renewals.filter(item => {

        const matchesStatus =
            !status || item.status === status;

        const matchesCategory =
            !category || item.category === category;

        const matchesPriority =
            !priority || item.priority === priority;

        const matchesSearch =
            !search ||
            String(item.name || "")
                .toLowerCase()
                .includes(search);

        return (
            matchesStatus &&
            matchesCategory &&
            matchesPriority &&
            matchesSearch
        );
    });

    renderTable(filtered);
}

function renderTable(data) {

    reportTable.innerHTML = "";

    resultText.textContent =
        `${data.length} renewal${data.length !== 1 ? "s" : ""} found`;

    if (data.length === 0) {

        reportTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    No renewal records found
                </td>
            </tr>
        `;

        return;
    }

    data.forEach(item => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(item.name)}</td>

            <td>
                <span class="category-badge">
                    ${escapeHTML(item.category || "-")}
                </span>
            </td>

            <td>${formatDate(item.expiry_date)}</td>

            <td>₹${Number(item.cost || 0).toLocaleString("en-IN")}</td>

            <td>
                <span class="priority ${String(item.priority || "").toLowerCase()}">
                    ${escapeHTML(item.priority || "-")}
                </span>
            </td>

            <td>
                <span class="status ${getStatusClass(item.status)}">
                    ${escapeHTML(item.status || "-")}
                </span>
            </td>
        `;

        reportTable.appendChild(row);
    });
}

function getStatusClass(status) {

    if (!status) return "";

    return status
        .toLowerCase()
        .replace(/\s+/g, "-");
}

function formatDate(date) {

    if (!date) return "-";

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

/* Filters */

statusFilter.addEventListener("change", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
priorityFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

/* Logout */

document.getElementById("logoutBtn").addEventListener(
    "click",
    () => {
        localStorage.clear();
        window.location.href = "login.html";
    }
);

/* User */

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
        document.getElementById("usersLink").style.display = "none";
        document.getElementById("auditLink").style.display = "none";
    }
}

/* Theme */

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

/* Start */

loadReports();