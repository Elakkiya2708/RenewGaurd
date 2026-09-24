const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    "Authorization": `Bearer ${token}`
};

const renewalSelect = document.getElementById("renewalSelect");
const fileInput = document.getElementById("fileInput");
const fileName = document.getElementById("fileName");
const message = document.getElementById("message");
const uploadBtn = document.getElementById("uploadBtn");

const documentsTable =
    document.getElementById("documentsTable");

const searchInput =
    document.getElementById("searchInput");

const resultText =
    document.getElementById("resultText");

const documentCount =
    document.getElementById("documentCount");

const pdfCount =
    document.getElementById("pdfCount");

const imageCount =
    document.getElementById("imageCount");

const storageUsed =
    document.getElementById("storageUsed");

const successNotification =
    document.getElementById("successNotification");

let documents = [];


// ===============================
// LOAD RENEWALS
// ===============================

async function loadRenewals() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/renewals",
            {
                headers
            }
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

            const option =
                document.createElement("option");

            option.value = item.id;
            option.textContent = item.name;

            renewalSelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        message.textContent =
            error.message || "Failed to load renewals";

        message.style.color = "#EF4444";
    }
}


// ===============================
// LOAD DOCUMENTS
// ===============================

async function loadDocuments() {

    try {

        documentsTable.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    Loading documents...
                </td>
            </tr>
        `;

        const response = await fetch(
            "http://localhost:5000/api/documents",
            {
                headers
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load documents"
            );

        }

        documents =
            Array.isArray(data) ? data : [];

        updateSummary();

        applySearch();

    } catch (error) {

        console.error(
            "DOCUMENT LOAD ERROR:",
            error
        );

        documentsTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty">
                    Unable to load documents
                </td>
            </tr>
        `;

        resultText.textContent =
            "Error loading documents";
    }
}


// ===============================
// SUMMARY
// ===============================

function updateSummary() {

    documentCount.textContent =
        documents.length;


    pdfCount.textContent =
        documents.filter(item =>
            item.file_type === "application/pdf"
        ).length;


    imageCount.textContent =
        documents.filter(item =>
            item.file_type &&
            item.file_type.startsWith("image/")
        ).length;


    const totalBytes =
        documents.reduce(
            (total, item) =>
                total + Number(item.file_size || 0),
            0
        );


    storageUsed.textContent =
        formatSize(totalBytes);
}


// ===============================
// SEARCH
// ===============================

function applySearch() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        documents.filter(item => {

            const fileName =
                String(item.file_name || "")
                    .toLowerCase();

            const renewalName =
                String(
                    item.renewals?.name || ""
                ).toLowerCase();

            return (
                fileName.includes(search) ||
                renewalName.includes(search)
            );

        });


    renderDocuments(filtered);
}


// ===============================
// RENDER DOCUMENTS
// ===============================

function renderDocuments(data) {

    documentsTable.innerHTML = "";


    resultText.textContent =
        `${data.length} document${data.length !== 1 ? "s" : ""} found`;


    if (data.length === 0) {

        documentsTable.innerHTML = `
            <tr>
                <td colspan="6" class="empty">

                    <strong>
                        No documents found
                    </strong>

                    Upload a document or change your search.

                </td>
            </tr>
        `;

        return;
    }


    data.forEach(item => {

        const row =
            document.createElement("tr");


        const type =
            getFileType(item.file_type);


        const icon =
            getFileIcon(item.file_type);


        row.innerHTML = `

            <td class="document-name">

                <span class="file-icon">
                    ${icon}
                </span>

                <span>
                    ${escapeHTML(item.file_name)}
                </span>

            </td>


            <td>

                ${escapeHTML(
                    item.renewals?.name || "-"
                )}

            </td>


            <td>

                <span class="type-badge">
                    ${type}
                </span>

            </td>


            <td>
                ${formatSize(item.file_size)}
            </td>


            <td>
                ${formatDate(item.uploaded_at)}
            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="download-btn"
                        onclick="downloadDocument(${item.id})">

                        Download

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteDocument(${item.id})">

                        Delete

                    </button>

                </div>

            </td>

        `;


        documentsTable.appendChild(row);

    });
}


// ===============================
// DOWNLOAD
// ===============================

async function downloadDocument(id) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/documents/download/${id}`,
            {
                headers
            }
        );


        if (!response.ok) {

            const data =
                await response.json();

            throw new Error(
                data.message || "Download failed"
            );

        }


        const blob =
            await response.blob();


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");

        link.href = url;

        link.download = "";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);


    } catch (error) {

        console.error(
            "DOWNLOAD ERROR:",
            error
        );

        alert(
            error.message ||
            "Unable to download document"
        );
    }
}


// ===============================
// DELETE
// ===============================

async function deleteDocument(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this document?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/documents/${id}`,
            {
                method: "DELETE",
                headers
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Delete failed"
            );

        }


        alert(
            "Document deleted successfully!"
        );


        loadDocuments();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );

        alert(
            error.message ||
            "Unable to delete document"
        );
    }
}


// ===============================
// UPLOAD
// ===============================

uploadBtn.addEventListener(
    "click",
    async function () {

        const renewalId =
            renewalSelect.value;

        const file =
            fileInput.files[0];


        if (!renewalId) {

            message.textContent =
                "Please select a renewal";

            message.style.color =
                "#EF4444";

            return;
        }


        if (!file) {

            message.textContent =
                "Please select a file";

            message.style.color =
                "#EF4444";

            return;
        }


        if (file.size > 10 * 1024 * 1024) {

            message.textContent =
                "File size must be less than 10 MB";

            message.style.color =
                "#EF4444";

            return;
        }


        uploadBtn.disabled = true;

        uploadBtn.textContent =
            "Uploading...";


        message.textContent =
            "Uploading document...";

        message.style.color =
            "#F59E0B";


        const formData =
            new FormData();


        formData.append(
            "renewal_id",
            renewalId
        );


        formData.append(
            "file",
            file
        );


        try {

            const response = await fetch(
                "http://localhost:5000/api/documents",
                {
                    method: "POST",
                    headers,
                    body: formData
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Document upload failed"
                );

            }


            message.textContent =
                "Document uploaded successfully!";

            message.style.color =
                "#22C55E";


            showSuccessNotification();


            fileInput.value = "";

            renewalSelect.value = "";

            fileName.textContent =
                "Choose a file";


            await loadDocuments();


        } catch (error) {

            console.error(
                "UPLOAD ERROR:",
                error
            );

            message.textContent =
                "✕ " + error.message;

            message.style.color =
                "#EF4444";


        } finally {

            uploadBtn.disabled = false;

            uploadBtn.textContent =
                "Upload Document";

        }

    }
);


// ===============================
// FILE NAME
// ===============================

fileInput.addEventListener(
    "change",
    function () {

        if (this.files.length > 0) {

            fileName.textContent =
                this.files[0].name;

        } else {

            fileName.textContent =
                "Choose a file";

        }

    }
);


// ===============================
// SUCCESS NOTIFICATION
// ===============================

let notificationTimer;

function showSuccessNotification() {

    successNotification.style.display =
        "flex";


    clearTimeout(notificationTimer);


    notificationTimer =
        setTimeout(() => {

            successNotification.style.display =
                "none";

        }, 5000);
}


// ===============================
// SEARCH EVENT
// ===============================

searchInput.addEventListener(
    "input",
    applySearch
);


// ===============================
// FILE TYPE
// ===============================

function getFileType(type) {

    if (!type) {
        return "File";
    }

    if (type === "application/pdf") {
        return "PDF";
    }

    if (
        type === "application/msword" ||
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return "DOC";
    }

    if (type.startsWith("image/")) {
        return "Image";
    }

    return "File";
}


// ===============================
// FILE ICON
// ===============================

function getFileIcon(type) {

    if (type === "application/pdf") {
        return "📕";
    }

    if (type && type.startsWith("image/")) {
        return "🖼️";
    }

    if (
        type === "application/msword" ||
        type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        return "📘";
    }

    return "📄";
}


// ===============================
// FILE SIZE
// ===============================

function formatSize(bytes) {

    bytes =
        Number(bytes || 0);


    if (bytes === 0) {
        return "0 MB";
    }


    const mb =
        bytes / (1024 * 1024);


    if (mb < 1) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }


    return mb.toFixed(2) + " MB";
}


// ===============================
// DATE
// ===============================

function formatDate(date) {

    if (!date) {
        return "-";
    }


    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(
            /'/g,
            "&#039;"
        );
}


// ===============================
// LOGOUT
// ===============================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.clear();

            window.location.href =
                "login.html";

        }
    );


// ===============================
// USER INFO
// ===============================

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


if (user) {

    document.getElementById(
        "userName"
    ).textContent =
        user.name || "User";


    document.getElementById(
        "userRole"
    ).textContent =
        user.role || "Employee";


    document.getElementById(
        "userAvatar"
    ).textContent =
        (user.name || "U")
            .charAt(0)
            .toUpperCase();


    // Hide admin links

    if (user.role !== "Admin") {

        document.getElementById(
            "usersLink"
        ).style.display = "none";


        document.getElementById(
            "auditLink"
        ).style.display = "none";

    }

}


// ===============================
// THEME
// ===============================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeToggle.textContent =
        "🌙";

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-theme"
        );


        const isLight =
            document.body.classList.contains(
                "light-theme"
            );


        localStorage.setItem(
            "theme",
            isLight ? "light" : "dark"
        );


        themeToggle.textContent =
            isLight ? "🌙" : "☀️";

    }
);


// ===============================
// START
// ===============================

loadRenewals();

loadDocuments();