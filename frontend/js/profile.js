const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};


/* =========================
   ELEMENTS
========================= */

const form = document.getElementById("profileForm");
const message = document.getElementById("message");
const roleBadge = document.getElementById("roleBadge");

const passwordForm = document.getElementById("passwordForm");
const passwordMessage =
    document.getElementById("passwordMessage");


/* =========================
   LOAD PROFILE
========================= */

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
            throw new Error(
                data.message || "Failed to load profile"
            );
        }

        document.getElementById("full_name").value =
            data.full_name || "";

        document.getElementById("email").value =
            data.email || "";

        document.getElementById("mobile").value =
            data.mobile || "";

        document.getElementById("organization").value =
            data.organization || "";

        document.getElementById("department").value =
            data.department || "";

        document.getElementById("employee_id").value =
            data.employee_id || "";

        roleBadge.textContent =
            data.role || "Employee";

    } catch (error) {

        console.error("PROFILE ERROR:", error);

        message.textContent =
            error.message || "Failed to load profile";

        message.style.color = "red";
    }
}


/* =========================
   UPDATE PROFILE
========================= */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const profile = {

        full_name:
            document.getElementById("full_name").value.trim(),

        mobile:
            document.getElementById("mobile").value.trim(),

        organization:
            document.getElementById("organization").value.trim(),

        department:
            document.getElementById("department").value.trim(),

        employee_id:
            document.getElementById("employee_id").value.trim()
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

        message.textContent =
            "Profile updated successfully!";

        message.style.color = "#22C55E";


        /* Update local user information */

        const user =
            JSON.parse(localStorage.getItem("user")) || {};

        user.name = profile.full_name;

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        updateUserInfo();

    } catch (error) {

        console.error("PROFILE UPDATE ERROR:", error);

        message.textContent =
            error.message || "Profile update failed";

        message.style.color = "#EF4444";
    }
});


/* =========================
   CHANGE PASSWORD
========================= */

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

        passwordMessage.style.color =
            "#EF4444";

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

        passwordMessage.style.color =
            "#22C55E";

        passwordForm.reset();

    } catch (error) {

        console.error(
            "PASSWORD ERROR:",
            error
        );

        passwordMessage.textContent =
            error.message || "Password change failed";

        passwordMessage.style.color =
            "#EF4444";
    }
});


/* =========================
   USER INFO
========================= */

function updateUserInfo() {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) return;


    document.getElementById("userName").textContent =
        user.name || "User";

    document.getElementById("userRole").textContent =
        user.role || "Employee";

    document.getElementById("userAvatar").textContent =
        (user.name || "U")
            .charAt(0)
            .toUpperCase();


    /* Admin links */

    if (user.role !== "Admin") {

        const usersLink =
            document.getElementById("usersLink");

        const auditLink =
            document.getElementById("auditLink");

        if (usersLink) {
            usersLink.style.display = "none";
        }

        if (auditLink) {
            auditLink.style.display = "none";
        }
    }
}

updateUserInfo();


/* =========================
   LOGOUT
========================= */

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "login.html";
    });


/* =========================
   THEME
========================= */

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeToggle.textContent = "🌙";
}


themeToggle.addEventListener("click", () => {

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
});


/* =========================
   LOAD
========================= */

loadProfile();