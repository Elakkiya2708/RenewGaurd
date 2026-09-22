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

        renewalSelect.innerHTML =
            '<option value="">Select a renewal</option>';

        data.forEach(item => {
            const option = document.createElement("option");

            option.value = item.id;
            option.textContent = item.name;

            renewalSelect.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        message.textContent = "Failed to load renewals";
    }
}

document.getElementById("uploadBtn").addEventListener("click", async () => {

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

    const formData = new FormData();

    formData.append("renewal_id", renewalId);
    formData.append("file", file);

    try {

        message.style.color = "#f59e0b";
        message.textContent = "Uploading...";

        const response = await fetch(
            "http://localhost:5000/api/documents",
            {
                method: "POST",
                body: formData
            }
        );

        const text = await response.text();

        console.log("STATUS:", response.status);
        console.log("RESPONSE:", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }

        if (!response.ok) {
            message.style.color = "#ef4444";
            message.textContent =
                data.message || "Upload failed";

            return;
        }

        message.style.color = "#22c55e";
        message.textContent =
            "✓ Document uploaded successfully!";

        fileInput.value = "";
        renewalSelect.value = "";

    } catch (error) {

        console.error("FETCH ERROR:", error);

        message.style.color = "#ef4444";
        message.textContent =
            "Unable to connect to server";
    }
});

loadRenewals();