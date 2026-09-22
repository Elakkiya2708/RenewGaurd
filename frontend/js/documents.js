const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const renewalSelect = document.getElementById("renewalSelect");
const fileInput = document.getElementById("fileInput");
const message = document.getElementById("message");

async function loadRenewals() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals"
        );

        const data = await response.json();

        data.forEach(item => {

            const option = document.createElement("option");

            option.value = item.id;
            option.textContent = item.name;

            renewalSelect.appendChild(option);
        });

    } catch (error) {

        message.textContent =
            "Failed to load renewals";
    }
}

document.getElementById("uploadBtn")
    .addEventListener("click", async () => {

        const renewalId = renewalSelect.value;
        const file = fileInput.files[0];

        if (!renewalId || !file) {
            message.textContent =
                "Select renewal and file";
            return;
        }

        const formData = new FormData();

        formData.append("renewal_id", renewalId);
        formData.append("file", file);

        try {

            const response = await fetch(
                "http://localhost:5000/api/documents",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
    message.style.color = "#ef4444";
    message.textContent = data.message;
    return;
}

message.style.color = "#22c55e";
message.textContent = "✓ Document uploaded successfully!";

fileInput.value = "";
renewalSelect.value = "";
        } catch (error) {

            message.textContent =
                "Unable to connect to server";
        }
    });

loadRenewals();