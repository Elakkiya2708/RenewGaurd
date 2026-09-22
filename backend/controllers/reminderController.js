const supabase = require("../config/database");

exports.getReminders = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("reminders")
            .select(`
                *,
                renewals (
                    name,
                    expiry_date
                )
            `)
            .order("reminder_date", { ascending: true });

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.json(data);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.addReminder = async (req, res) => {
    try {
        const {
            renewal_id,
            reminder_date,
            reminder_days
        } = req.body;

        if (!renewal_id || !reminder_date) {
            return res.status(400).json({
                message: "Renewal and reminder date are required"
            });
        }

        const { data, error } = await supabase
            .from("reminders")
            .insert([{
                renewal_id,
                reminder_date,
                reminder_days: reminder_days || null,
                status: "Pending"
            }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.status(201).json({
            message: "Reminder added successfully",
            reminder: data
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};