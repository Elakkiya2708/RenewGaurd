const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
    window.location.href = "renewals.html";
}

async function loadRenewal() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/renewals`
        );

        const data = await response.json();

        const renewal = data.find(item => item.id == id);

        if (!renewal) {
            alert("Renewal not found");
            window.location.href = "renewals.html";
            return;
        }

        document.getElementById("name").value =
            renewal.name || "";

        document.getElementById("category").value =
            renewal.category || "Other";

        document.getElementById("organization").value =
            renewal.organization || "";

        document.getElementById("start_date").value =
            renewal.start_date || "";

        document.getElementById("expiry_date").value =
            renewal.expiry_date || "";

        document.getElementById("cost").value =
            renewal.cost || 0;

        document.getElementById("priority").value =
            renewal.priority || "Medium";

        document.getElementById("status").value =
            renewal.status || "Pending";

        document.getElementById("notes").value =
            renewal.notes || "";

    } catch (error) {
        alert("Unable to load renewal");
    }
}

document.getElementById("editForm").addEventListener("submit",
    async (e) => {

        e.preventDefault();

        const renewal = {
            name: document.getElementById("name").value,
            category: document.getElementById("category").value,
            organization: document.getElementById("organization").value,
            start_date: document.getElementById("start_date").value,
            expiry_date: document.getElementById("expiry_date").value,
            cost: document.getElementById("cost").value || 0,
            priority: document.getElementById("priority").value,
            status: document.getElementById("status").value,
            notes: document.getElementById("notes").value
        };

        try {

            const response = await fetch(
                `http://localhost:5000/api/renewals/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(renewal)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                document.getElementById("message").textContent =
                    data.message;
                return;
            }

            document.getElementById("message").textContent =
                "Renewal updated successfully!";

            setTimeout(() => {
                window.location.href = "renewals.html";
            }, 800);

        } catch (error) {

            document.getElementById("message").textContent =
                "Unable to connect to server";
        }
    }
);

loadRenewal();