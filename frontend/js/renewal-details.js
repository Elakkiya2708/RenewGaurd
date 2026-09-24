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
            throw new Error(data.message || "Failed to load renewal");
        }

        renewal = data.find(item => item.id == id);

        if (!renewal) {
            document.getElementById("details").innerHTML =
                "<p>Renewal not found</p>";
            return;
        }

        document.getElementById("details").innerHTML = `
            <div class="details-box">

                <p><strong>Name:</strong> ${renewal.name}</p>

                <p><strong>Category:</strong> ${renewal.category}</p>

                <p><strong>Organization:</strong>
                    ${renewal.organization || "-"}
                </p>

                <p><strong>Start Date:</strong>
                    ${renewal.start_date || "-"}
                </p>

                <p><strong>Expiry Date:</strong>
                    ${renewal.expiry_date}
                </p>

                <p><strong>Cost:</strong>
                    ₹${renewal.cost || 0}
                </p>

                <p><strong>Priority:</strong>
                    ${renewal.priority}
                </p>

                <p><strong>Status:</strong>
                    ${renewal.status}
                </p>

                <p><strong>Notes:</strong>
                    ${renewal.notes || "-"}
                </p>

            </div>
        `;

    } catch (error) {

        console.error("Details Error:", error);

        document.getElementById("details").innerHTML =
            "<p>Unable to load renewal details</p>";
    }
}

function editRenewal() {
    window.location.href =
        `edit-renewal.html?id=${id}`;
}

loadDetails();