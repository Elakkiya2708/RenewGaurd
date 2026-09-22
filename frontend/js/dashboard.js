const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

if (!token || !user) {
    window.location.href = "login.html";
}

document.getElementById("userName").textContent = user.name;
document.getElementById("userRole").textContent = user.role;
document.getElementById("userAvatar").textContent =
    user.name.charAt(0).toUpperCase();


document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";
});