const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const usersTable = document.getElementById("usersTable");
const searchUser = document.getElementById("searchUser");
const roleFilter = document.getElementById("roleFilter");

let allUsers = [];

const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
};


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

        allUsers = users;

        displayUsers(allUsers);

    } catch (error) {

        console.error("Users Error:", error);

        usersTable.innerHTML = `
            <tr>
                <td colspan="8">
                    ${error.message}
                </td>
            </tr>
        `;
    }
}


function displayUsers(users) {

    if (users.length === 0) {

        usersTable.innerHTML = `
            <tr>
                <td colspan="8">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }

    usersTable.innerHTML = users.map(user => {

        const roleClass = user.role.toLowerCase();

        return `
            <tr>

                <td>${user.id}</td>

                <td>${user.full_name || "-"}</td>

                <td>${user.email || "-"}</td>

                <td>${user.organization || "-"}</td>

                <td>${user.department || "-"}</td>

                <td>${user.employee_id || "-"}</td>

                <td>
                    <span class="role role-${roleClass}">
                        ${user.role}
                    </span>
                </td>

                <td>

                    <button
                        class="action-btn role-btn"
                        onclick="changeRole(${user.id}, '${user.role}')">
                        Change Role
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteUser(${user.id}, '${user.full_name}')">
                        Delete
                    </button>

                </td>

            </tr>
        `;

    }).join("");
}


function filterUsers() {

    const search =
        searchUser.value.toLowerCase().trim();

    const role =
        roleFilter.value;

    const filtered = allUsers.filter(user => {

        const matchesSearch =
            (user.full_name || "")
                .toLowerCase()
                .includes(search) ||

            (user.email || "")
                .toLowerCase()
                .includes(search);

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

        loadUsers();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


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

        loadUsers();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


loadUsers();