const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const usersTable = document.getElementById("usersTable");

async function loadUsers() {
    try {

        const response = await fetch(
            "http://localhost:5000/api/users"
        );

        const users = await response.json();

        if (!response.ok) {
            throw new Error(
                users.message || "Failed to load users"
            );
        }

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

            const roleClass =
                user.role.toLowerCase();

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

    } catch (error) {

        console.error("Users Error:", error);

        usersTable.innerHTML = `
            <tr>
                <td colspan="8">
                    Failed to load users.
                </td>
            </tr>
        `;
    }
}


async function changeRole(id, currentRole) {

    const newRole =
        currentRole === "Admin"
            ? "Employee"
            : "Admin";

    const confirmChange = confirm(
        `Change role from ${currentRole} to ${newRole}?`
    );

    if (!confirmChange) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/users/${id}/role`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
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

    const confirmDelete = confirm(
        `Delete user "${name}"?`
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/users/${id}`,
            {
                method: "DELETE"
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