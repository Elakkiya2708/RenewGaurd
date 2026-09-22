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
            throw new Error(
                data.message || "Failed to load renewals"
            );
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


// Success Notification
function showSuccessNotification() {

    successNotification.removeAttribute("style");

    successNotification.style.cssText = `
        display: flex !important;
        position: fixed;
        top: 25px;
        right: 25px;
        z-index: 99999;
        background: #16a34a;
        color: white;
        padding: 16px 22px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(0,0,0,0.35);
        align-items: center;
        gap: 10px;
    `;

    setTimeout(() => {
        successNotification.style.display = "none";
    }, 15000);
}


// Upload Document
uploadBtn.addEventListener("click", async function () {

    const renewalId = renewalSelect.value;
    const file = fileInput.files[0];


    // Check Renewal
    if (!renewalId) {

        message.style.color = "#ef4444";
        message.textContent = "Please select a renewal";

        return;
    }


    // Check File
    if (!file) {

        message.style.color = "#ef4444";
        message.textContent = "Please select a file";

        return;
    }


    // Check File Size
    if (file.size > 10 * 1024 * 1024) {

        message.style.color = "#ef4444";
        message.textContent =
            "File size must be less than 10 MB";

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


        // Error
        if (!response.ok) {

            throw new Error(
                data.message || "Document upload failed"
            );
        }


        // Success
        message.textContent = "";

        showSuccessNotification();


        // Clear Form
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


// Load Renewals
loadRenewals();