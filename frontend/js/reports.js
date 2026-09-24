const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");
const expiredCount = document.getElementById("expiredCount");
const renewedCount = document.getElementById("renewedCount");
const totalCost = document.getElementById("totalCost");
const reportTable = document.getElementById("reportTable");

async function loadReports() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/reports"
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Failed to load reports");
        }

        totalCount.textContent = result.total;
        upcomingCount.textContent = result.upcoming;
        expiredCount.textContent = result.expired;
        renewedCount.textContent = result.renewed;

        totalCost.textContent =
            "₹" + Number(result.totalCost).toLocaleString("en-IN");

        if (result.data.length === 0) {

            reportTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        No renewal records found.
                    </td>
                </tr>
            `;

            return;
        }

        reportTable.innerHTML = result.data.map(item => {

            const statusClass =
                (item.status || "")
                .toLowerCase()
                .replace(" ", "-");

            return `
                <tr>

                    <td>${item.name}</td>

                    <td>${item.category}</td>

                    <td>${item.organization || "-"}</td>

                    <td>${item.expiry_date}</td>

                    <td>
                        ₹${Number(item.cost || 0).toLocaleString("en-IN")}
                    </td>

                    <td>${item.priority}</td>

                    <td>
                        <span class="status ${statusClass}">
                            ${item.status}
                        </span>
                    </td>

                </tr>
            `;

        }).join("");

    } catch (error) {

        console.error("Reports Error:", error);

        reportTable.innerHTML = `
            <tr>
                <td colspan="7">
                    Failed to load reports.
                </td>
            </tr>
        `;
    }
}

loadReports();