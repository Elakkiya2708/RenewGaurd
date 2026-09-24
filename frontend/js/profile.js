const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const form = document.getElementById("profileForm");
const message = document.getElementById("message");
const roleBadge = document.getElementById("roleBadge");

const passwordForm = document.getElementById("passwordForm");
const passwordMessage = document.getElementById("passwordMessage");

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};


// Load profile
async function loadProfile() {
    try {

        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                headers: headers
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to load profile");
        }

        document.getElementById("full_name").value = data.full_name || "";
        document.getElementById("email").value = data.email || "";
        document.getElementById("mobile").value = data.mobile || "";
        document.getElementById("organization").value = data.organization || "";
        document.getElementById("department").value = data.department || "";
        document.getElementById("employee_id").value = data.employee_id || "";

        roleBadge.textContent = data.role || "Employee";

    } catch (error) {

        console.error(error);

        message.textContent = error.message;
        message.style.color = "red";
    }
}


// Update profile
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const profile = {
        full_name: document.getElementById("full_name").value,
        mobile: document.getElementById("mobile").value,
        organization: document.getElementById("organization").value,
        department: document.getElementById("department").value,
        employee_id: document.getElementById("employee_id").value
    };

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/profile",
            {
                method: "PUT",
                headers: headers,
                body: JSON.stringify(profile)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Profile update failed"
            );
        }

        message.textContent = "Profile updated successfully!";
        message.style.color = "green";

    } catch (error) {

        console.error(error);

        message.textContent = error.message;
        message.style.color = "red";
    }
});


// Change Password
passwordForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (newPassword !== confirmPassword) {

        passwordMessage.textContent =
            "New passwords do not match.";

        passwordMessage.style.color = "red";

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:5000/api/users/password",
            {
                method: "PUT",
                headers: headers,
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Password change failed"
            );
        }

        passwordMessage.textContent =
            "Password changed successfully!";

        passwordMessage.style.color = "green";

        passwordForm.reset();

    } catch (error) {

        console.error(error);

        passwordMessage.textContent = error.message;
        passwordMessage.style.color = "red";
    }
});


loadProfile();