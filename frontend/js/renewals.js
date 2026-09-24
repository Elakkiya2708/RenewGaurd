const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

let renewals = [];

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};


// Load Renewals
async function loadRenewals() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals",
            {
                headers: headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load renewals");
        }

        renewals = data;

        displayRenewals(renewals);

    } catch (error) {

        console.error(error);

        document.getElementById("renewalTable").innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    ${error.message}
                </td>
            </tr>
        `;
    }
}


// Display Renewals
function displayRenewals(data) {

    const table =
        document.getElementById("renewalTable");

    if (data.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    No renewal records found
                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = data.map(item => `
        <tr>

            <td>${item.name}</td>

            <td>${item.category}</td>

            <td>${item.organization || "-"}</td>

            <td>${item.expiry_date}</td>

            <td class="${item.priority.toLowerCase()}">
                ${item.priority}
            </td>

            <td>
                <span class="badge ${getStatusClass(item.status)}">
                    ${item.status}
                </span>
            </td>

            <td>

                <button
                    class="action-btn"
                    onclick="viewRenewal(${item.id})">
                    View
                </button>

                <button
                    class="action-btn"
                    onclick="editRenewal(${item.id})">
                    Edit
                </button>

                <button
                    class="action-btn"
                    onclick="deleteRenewal(${item.id})">
                    Delete
                </button>

            </td>

        </tr>
    `).join("");
}


// Status Class
function getStatusClass(status) {

    if (status === "Renewed")
        return "renewed";

    if (status === "Expired")
        return "expired";

    if (status === "In Progress")
        return "progress";

    return "pending";
}


// Filter
function filterRenewals() {

    const search = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const category =
        document.getElementById("categoryFilter").value;

    const status =
        document.getElementById("statusFilter").value;

    const filtered = renewals.filter(item =>
        item.name.toLowerCase().includes(search) &&
        (!category || item.category === category) &&
        (!status || item.status === status)
    );

    displayRenewals(filtered);
}


// View
function viewRenewal(id) {

    window.location.href =
        `renewal-details.html?id=${id}`;
}


// Edit
function editRenewal(id) {

    window.location.href =
        `edit-renewal.html?id=${id}`;
}


// Delete
async function deleteRenewal(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this renewal?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/renewals/${id}`,
            {
                method: "DELETE",
                headers: headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Renewal deleted successfully");

        loadRenewals();

    } catch (error) {

        console.error(error);

        alert("Unable to connect to server");
    }
}


// Search
document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterRenewals
    );


// Category Filter
document
    .getElementById("categoryFilter")
    .addEventListener(
        "change",
        filterRenewals
    );


// Status Filter
document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        filterRenewals
    );


// Logout
document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";
        }
    );


// Start
loadRenewals();