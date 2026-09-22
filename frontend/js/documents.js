const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const renewalSelect = document.getElementById("renewalSelect");
const fileInput = document.getElementById("fileInput");
const message = document.getElementById("message");
const uploadBtn = document.getElementById("uploadBtn");


// Load Renewals
async function loadRenewals() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/renewals"
        );

        const data = await response.json();

        renewalSelect.innerHTML =
            '<option value="">Select a renewal</option>';

        data.forEach(item => {
            const option = document.createElement("option");

            option.value = item.id;
            option.textContent = item.name;

            renewalSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Renewal Error:", error);

        message.style.color = "#ef4444";
        message.textContent = "Failed to load renewals";
    }
}


// Upload Document
uploadBtn.addEventListener("click", async () => {

    const renewalId = renewalSelect.value;
    const file = fileInput.files[0];

    message.textContent = "";

    if (!renewalId) {
        message.style.color = "#ef4444";
        message.textContent = "Please select a renewal";
        return;
    }

    if (!file) {
        message.style.color = "#ef4444";
        message.textContent = "Please select a file";
        return;
    }

    // Show uploading message
    message.style.color = "#f59e0b";
    message.textContent = "Uploading...";

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

        const text = await response.text();

        // Show exact backend response
        message.style.color =
            response.ok ? "#22c55e" : "#ef4444";

        message.textContent =
            "STATUS: " + response.status +
            " | " + text;

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = {
                message: text
            };
        }

        // Upload failed
        if (!response.ok) {
            return;
        }

        // Upload successful
        message.style.color = "#22c55e";
        message.textContent =
            "✓ Document uploaded successfully!";

        fileInput.value = "";
        renewalSelect.value = "";

    } catch (error) {

        console.error("Upload Error:", error);

        message.style.color = "#ef4444";

        message.textContent =
            "Unable to connect to server";
    }
});


// Load renewals when page opens
loadRenewals();