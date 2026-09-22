const supabase = require("../config/database");

async function createDefaultReminders(renewalId, expiryDate) {
    const expiry = new Date(expiryDate);

    const days = [30, 15, 7];

    const reminders = days.map(day => {
        const date = new Date(expiry);
        date.setDate(date.getDate() - day);

        return {
            renewal_id: renewalId,
            reminder_date: date.toISOString().split("T")[0],
            reminder_days: day,
            status: "Pending"
        };
    });

    const { error } = await supabase
        .from("reminders")
        .insert(reminders);

    if (error) {
        console.error("Reminder creation error:", error);
    }
}

module.exports = { createDefaultReminders };