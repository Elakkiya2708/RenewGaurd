const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    window.location.href = "renewals.html";
}

let renewal;


/* =========================
   LOAD RENEWAL DETAILS
========================= */

async function loadDetails() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load renewal"
            );
        }


        /* Find selected renewal */

        renewal = data.find(
            item => item.id == id
        );


        /* Renewal not found */

        if (!renewal) {

            document.getElementById("details").innerHTML = `
                <div class="loading">
                    Renewal not found
                </div>
            `;

            return;
        }


        /* Status class */

        let statusClass = "";

        if (renewal.status === "Pending") {
            statusClass = "pending";
        }

        else if (renewal.status === "In Progress") {
            statusClass = "in-progress";
        }

        else if (renewal.status === "Renewed") {
            statusClass = "renewed";
        }

        else if (renewal.status === "Expired") {
            statusClass = "expired";
        }


        /* Priority class */

        let priorityClass = "";

        if (renewal.priority === "High") {
            priorityClass = "high";
        }

        else if (renewal.priority === "Medium") {
            priorityClass = "medium";
        }

        else if (renewal.priority === "Low") {
            priorityClass = "low";
        }


        /* Display details */

        document.getElementById("details").innerHTML = `

            <div class="details-box">

                <!-- Renewal Name -->

                <div class="detail-item">

                    <span class="detail-label">
                        Renewal Name
                    </span>

                    <span class="detail-value">
                        ${renewal.name}
                    </span>

                </div>


                <!-- Category -->

                <div class="detail-item">

                    <span class="detail-label">
                        Category
                    </span>

                    <span class="detail-value">
                        ${renewal.category}
                    </span>

                </div>


                <!-- Organization -->

                <div class="detail-item">

                    <span class="detail-label">
                        Organization / Vendor
                    </span>

                    <span class="detail-value">
                        ${renewal.organization || "-"}
                    </span>

                </div>


                <!-- Start Date -->

                <div class="detail-item">

                    <span class="detail-label">
                        Start Date
                    </span>

                    <span class="detail-value">
                        ${renewal.start_date || "-"}
                    </span>

                </div>


                <!-- Expiry Date -->

                <div class="detail-item">

                    <span class="detail-label">
                        Expiry Date
                    </span>

                    <span class="detail-value">
                        ${renewal.expiry_date}
                    </span>

                </div>


                <!-- Cost -->

                <div class="detail-item">

                    <span class="detail-label">
                        Cost
                    </span>

                    <span class="detail-value">
                        ₹${renewal.cost || 0}
                    </span>

                </div>


                <!-- Priority -->

                <div class="detail-item">

                    <span class="detail-label">
                        Priority
                    </span>

                    <span class="detail-value">

                        <span class="priority ${priorityClass}">
                            ${renewal.priority}
                        </span>

                    </span>

                </div>


                <!-- Status -->

                <div class="detail-item">

                    <span class="detail-label">
                        Status
                    </span>

                    <span class="detail-value">

                        <span class="status ${statusClass}">
                            ${renewal.status}
                        </span>

                    </span>

                </div>


                <!-- Notes -->

                <div class="detail-item full">

                    <span class="detail-label">
                        Notes
                    </span>

                    <span class="detail-value">
                        ${renewal.notes || "-"}
                    </span>

                </div>

            </div>

        `;

    }

    catch (error) {

        console.error(
            "Renewal Details Error:",
            error
        );

        document.getElementById("details").innerHTML = `
            <div class="loading">
                Unable to load renewal details
            </div>
        `;
    }
}


/* =========================
   EDIT RENEWAL
========================= */

function editRenewal() {

    if (!id) {
        return;
    }

    window.location.href =
        `edit-renewal.html?id=${id}`;
}


/* =========================
   LOAD PAGE
========================= */

loadDetails();