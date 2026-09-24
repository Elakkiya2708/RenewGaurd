const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};

// User details
const user = JSON.parse(localStorage.getItem("user") || "{}");

const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const userAvatar = document.getElementById("userAvatar");

// Show user details
if (user.full_name) {
    userName.textContent = user.full_name;
    userAvatar.textContent = user.full_name.charAt(0).toUpperCase();
}

if (user.role) {
    userRole.textContent = user.role;
}

// Hide User Management for Employee
if (user.role !== "Admin") {
    const userManagement = document.querySelector(
        'a[href="users.html"]'
    );

    if (userManagement) {
        userManagement.style.display = "none";
    }
    const auditLogs = document.querySelector('a[href="audit-logs.html"]');
    if (auditLogs) auditLogs.style.display = "none";
}


// Load dashboard data
async function loadDashboard() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals",
            {
                headers: headers
            }
        );

        const renewals = await response.json();

        if (!response.ok) {
            throw new Error(
                renewals.message || "Failed to load dashboard"
            );
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let expiringSoon = 0;
        let expired = 0;
        let renewed = 0;
        let pending = 0;
        let highPriority = 0;

        renewals.forEach(item => {

            const expiry = new Date(item.expiry_date);
            expiry.setHours(0, 0, 0, 0);

            const days =
                Math.ceil(
                    (expiry - today) /
                    (1000 * 60 * 60 * 24)
                );

            if (item.status === "Renewed") {
                renewed++;
            }

            if (
                item.status === "Expired" ||
                expiry < today
            ) {
                expired++;
            }

            if (
                days >= 0 &&
                days <= 30 &&
                item.status !== "Renewed"
            ) {
                expiringSoon++;
            }

            if (item.status === "Pending") {
                pending++;
            }

            if (item.priority === "High") {
                highPriority++;
            }
        });

        document.getElementById("totalRenewals").textContent =
            renewals.length;

        document.getElementById("expiringSoon").textContent =
            expiringSoon;

        document.getElementById("expired").textContent =
            expired;

        document.getElementById("renewed").textContent =
            renewed;

        document.getElementById("pending").textContent =
            pending;

        document.getElementById("highPriority").textContent =
            highPriority;


        // Recent renewals
        const recent = renewals.slice(0, 5);

        const recentDiv =
            document.getElementById("recentRenewals");

        if (recent.length === 0) {

            recentDiv.innerHTML =
                "No renewal records yet.";

        } else {

            recentDiv.innerHTML = recent.map(item => `
                <div class="renewal-item">
                    <strong>${item.name}</strong>
                    <span>${item.category}</span>
                    <small>
                        Expiry: ${item.expiry_date}
                    </small>
                </div>
            `).join("");
        }


        // Upcoming renewals
        const upcoming = renewals
            .filter(item => {

                const expiry =
                    new Date(item.expiry_date);

                const days =
                    Math.ceil(
                        (expiry - today) /
                        (1000 * 60 * 60 * 24)
                    );

                return (
                    days >= 0 &&
                    days <= 30 &&
                    item.status !== "Renewed"
                );

            })
            .slice(0, 5);


        const upcomingDiv =
            document.getElementById("upcomingRenewals");

        if (upcoming.length === 0) {

            upcomingDiv.innerHTML =
                "No upcoming renewals.";

        } else {

            upcomingDiv.innerHTML =
                upcoming.map(item => `
                    <div class="renewal-item">
                        <strong>${item.name}</strong>
                        <span>${item.category}</span>
                        <small>
                            Expiry: ${item.expiry_date}
                        </small>
                    </div>
                `).join("");
        }

    } catch (error) {

        console.error("Dashboard Error:", error);

        document.getElementById("recentRenewals").textContent =
            error.message;

    }
}


// Logout
document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });


// Start
loadDashboard();

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "🌙";
} else {
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const isLight = document.body.classList.contains("light-theme");

    localStorage.setItem("theme", isLight ? "light" : "dark");

    themeToggle.textContent = isLight ? "🌙" : "☀️";
});