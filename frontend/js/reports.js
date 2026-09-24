const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const totalCount = document.getElementById("totalCount");
const upcomingCount = document.getElementById("upcomingCount");
const expiredCount = document.getElementById("expiredCount");
const renewedCount = document.getElementById("renewedCount");
const totalCost = document.getElementById("totalCost");

const categorySummary = document.getElementById("categorySummary");
const reportTable = document.getElementById("reportTable");


async function loadReports() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/reports"
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to load reports"
            );
        }


        /* =========================
           SUMMARY
        ========================= */

        totalCount.textContent = result.total;

        upcomingCount.textContent = result.upcoming;

        expiredCount.textContent = result.expired;

        renewedCount.textContent = result.renewed;

        totalCost.textContent =
            "₹" +
            Number(result.totalCost).toLocaleString("en-IN");


        /* =========================
           CATEGORY SUMMARY
        ========================= */

        const categories = result.categories || {};

        if (Object.keys(categories).length === 0) {

            categorySummary.innerHTML = `
                <p>No category data found.</p>
            `;

        } else {

            categorySummary.innerHTML =
                Object.entries(categories)
                    .map(([category, value]) => {

                        return `
                            <div class="category-item">

                                <div>
                                    <strong>${category}</strong>

                                    <span>
                                        ${value.count} renewal(s)
                                    </span>
                                </div>

                                <b>
                                    ₹${Number(value.cost)
                                        .toLocaleString("en-IN")}
                                </b>

                            </div>
                        `;

                    })
                    .join("");
        }


        /* =========================
           RENEWAL TABLE
        ========================= */

        if (!result.data || result.data.length === 0) {

            reportTable.innerHTML = `
                <tr>
                    <td colspan="7">
                        No renewal records found.
                    </td>
                </tr>
            `;

            return;
        }


        reportTable.innerHTML = result.data
            .map(item => {

                const statusClass =
                    (item.status || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-");

                return `
                    <tr>

                        <td>
                            ${item.name || "-"}
                        </td>

                        <td>
                            ${item.category || "-"}
                        </td>

                        <td>
                            ${item.organization || "-"}
                        </td>

                        <td>
                            ${item.expiry_date || "-"}
                        </td>

                        <td>
                            ₹${Number(item.cost || 0)
                                .toLocaleString("en-IN")}
                        </td>

                        <td>
                            ${item.priority || "-"}
                        </td>

                        <td>
                            <span class="status ${statusClass}">
                                ${item.status || "-"}
                            </span>
                        </td>

                    </tr>
                `;

            })
            .join("");


    } catch (error) {

        console.error("Reports Error:", error);

        categorySummary.innerHTML = `
            <p>Failed to load category data.</p>
        `;

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

function downloadPDF() {
    window.open(
        "http://localhost:5000/api/reports/pdf",
        "_blank"
    );
}

function downloadExcel() {
    window.open(
        "http://localhost:5000/api/reports/excel",
        "_blank"
    );
}