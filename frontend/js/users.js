const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const user = JSON.parse(localStorage.getItem("user"));

/* Admin only */
if (!user || user.role !== "Admin") {
    window.location.href = "dashboard.html";
}


const usersTable = document.getElementById("usersTable");
const searchUser = document.getElementById("searchUser");
const roleFilter = document.getElementById("roleFilter");

let allUsers = [];

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};


/* =========================
   USER INFO
========================= */

function updateUserInfo() {

    if (!user) return;

    document.getElementById("userName").textContent =
        user.name || "Admin";

    document.getElementById("userRole").textContent =
        user.role || "Admin";

    document.getElementById("userAvatar").textContent =
        (user.name || "A").charAt(0).toUpperCase();
}

updateUserInfo();


/* =========================
   LOAD USERS
========================= */

async function loadUsers() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/users",
            {
                headers: headers
            }
        );

        const users = await response.json();

        if (!response.ok) {
            throw new Error(
                users.message || "Failed to load users"
            );
        }

        allUsers = Array.isArray(users) ? users : [];

        displayUsers(allUsers);

    } catch (error) {

        console.error("USERS ERROR:", error);

        usersTable.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;
    }
}


/* =========================
   DISPLAY USERS
========================= */

function displayUsers(users) {

    if (users.length === 0) {

        usersTable.innerHTML = `
            <tr>
                <td colspan="8" class="loading">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    usersTable.innerHTML = users.map(user => {

        const roleClass =
            String(user.role || "Employee").toLowerCase();

        return `
            <tr>

                <td>${user.id}</td>

                <td>${escapeHTML(user.full_name || "-")}</td>

                <td>${escapeHTML(user.email || "-")}</td>

                <td>${escapeHTML(user.organization || "-")}</td>

                <td>${escapeHTML(user.department || "-")}</td>

                <td>${escapeHTML(user.employee_id || "-")}</td>

                <td>
                    <span class="role role-${roleClass}">
                        ${escapeHTML(user.role || "-")}
                    </span>
                </td>

                <td>

                    <button
                        class="action-btn role-btn"
                        onclick="changeRole(${user.id}, '${escapeHTML(user.role || "Employee")}')">
                        Change Role
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteUser(${user.id}, '${escapeHTML(user.full_name || "User")}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join("");
}


/* =========================
   SEARCH + FILTER
========================= */

function filterUsers() {

    const search =
        searchUser.value.toLowerCase().trim();

    const role =
        roleFilter.value;


    const filtered = allUsers.filter(user => {

        const name =
            (user.full_name || "").toLowerCase();

        const email =
            (user.email || "").toLowerCase();


        const matchesSearch =
            name.includes(search) ||
            email.includes(search);


        const matchesRole =
            role === "All" ||
            user.role === role;


        return matchesSearch && matchesRole;

    });


    displayUsers(filtered);
}


searchUser.addEventListener(
    "input",
    filterUsers
);

roleFilter.addEventListener(
    "change",
    filterUsers
);


/* =========================
   CHANGE ROLE
========================= */

async function changeRole(id, currentRole) {

    const newRole =
        currentRole === "Admin"
            ? "Employee"
            : "Admin";


    if (!confirm(
        `Change role from ${currentRole} to ${newRole}?`
    )) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/users/${id}/role`,
            {
                method: "PUT",

                headers: headers,

                body: JSON.stringify({
                    role: newRole
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Role update failed"
            );
        }


        alert("Role updated successfully!");

        await loadUsers();


    } catch (error) {

        console.error(
            "ROLE UPDATE ERROR:",
            error
        );

        alert(error.message);
    }
}


/* =========================
   DELETE USER
========================= */

async function deleteUser(id, name) {

    if (!confirm(
        `Delete user "${name}"?`
    )) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/users/${id}`,
            {
                method: "DELETE",
                headers: headers
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message || "Delete failed"
            );
        }


        alert("User deleted successfully!");

        await loadUsers();


    } catch (error) {

        console.error(
            "DELETE USER ERROR:",
            error
        );

        alert(error.message);
    }
}


/* =========================
   LOGOUT
========================= */

document.getElementById("logoutBtn")
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


/* =========================
   SAFE HTML
========================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================
   START
========================= */

loadUsers();