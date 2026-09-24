const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");

let currentDate = new Date();
let renewals = [];

async function loadRenewals() {
    try {
        const response = await fetch("http://localhost:5000/api/renewals");
        renewals = await response.json();
        renderCalendar();
    } catch (error) {
        console.error("Calendar Error:", error);
        calendar.innerHTML = "<p>Failed to load renewals.</p>";
    }
}

function renderCalendar() {
    calendar.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.className = "day empty";
        calendar.appendChild(empty);
    }

    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement("div");
        cell.className = "day";

        cell.innerHTML = `<div class="day-number">${day}</div>`;

        const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        renewals
            .filter(item => item.expiry_date === date)
            .forEach(item => {
                const renewal = document.createElement("div");
                renewal.className = "renewal";
                renewal.textContent = item.name;
                cell.appendChild(renewal);
            });

        calendar.appendChild(cell);
    }
}

document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

loadRenewals();calendar