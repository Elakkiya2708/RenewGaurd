const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

async function loadDashboard() {
    try {
        const response = await fetch("http://localhost:5000/api/renewals");

        const renewals = await response.json();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const soon = new Date();
        soon.setDate(today.getDate() + 30);

        const total = renewals.length;

        const expiring = renewals.filter(r => {
            const date = new Date(r.expiry_date);
            return date >= today && date <= soon;
        }).length;

        const expired = renewals.filter(r =>
            new Date(r.expiry_date) < today
        ).length;

        const renewed = renewals.filter(r =>
            r.status === "Renewed"
        ).length;

        const pending = renewals.filter(r =>
            r.status === "Pending"
        ).length;

        const high = renewals.filter(r =>
            r.priority === "High"
        ).length;

        document.getElementById("totalRenewals").textContent = total;
        document.getElementById("expiringSoon").textContent = expiring;
        document.getElementById("expired").textContent = expired;
        document.getElementById("renewed").textContent = renewed;
        document.getElementById("pending").textContent = pending;
        document.getElementById("highPriority").textContent = high;

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

loadDashboard();

document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});