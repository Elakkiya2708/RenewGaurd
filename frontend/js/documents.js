const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const renewalSelect = document.getElementById("renewalSelect");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const message = document.getElementById("message");
const uploadBtn = document.getElementById("uploadBtn");
const successNotification = document.getElementById("successNotification");


// Load Renewals
async function loadRenewals() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals"
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load renewals");
        }

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

        message.style.color = "#ef4444";
        message.textContent = "Failed to load renewals";
    }
}


// Show Success Notification
function showSuccessNotification() {
    successNotification.style.display = "flex";

    setTimeout(() => {
        successNotification.style.display = "none";
    }, 15000);
}


// Upload Document
uploadBtn.addEventListener("click", async function () {

    const renewalId = renewalSelect.value;
    const file = fileInput.files[0];


    // Validate Renewal
    if (!renewalId) {

        message.style.color = "#ef4444";
        message.textContent = "Please select a renewal";

        return;
    }


    // Validate File
    if (!file) {

        message.style.color = "#ef4444";
        message.textContent = "Please select a file";

        return;
    }


    // Validate Size
    if (file.size > 10 * 1024 * 1024) {

        message.style.color = "#ef4444";
        message.textContent = "File size must be less than 10 MB";

        return;
    }


    // Uploading
    uploadBtn.disabled = true;
    uploadBtn.textContent = "Uploading...";

    message.style.color = "#f59e0b";
    message.textContent = "Uploading document...";


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


        // Upload failed
        if (!response.ok) {

            throw new Error(
                data.message || "Document upload failed"
            );
        }


        // Upload successful
        message.textContent = "";

        showSuccessNotification();


        // Clear form
        fileInput.value = "";
        renewalSelect.value = "";
        fileName.textContent = "Choose a file";


    } catch (error) {

        console.error("Upload Error:", error);

        message.style.color = "#ef4444";

        message.textContent =
            "✕ " + error.message;


    } finally {

        uploadBtn.disabled = false;
        uploadBtn.textContent = "Upload Document";
    }

});


// Load renewals
loadRenewals();