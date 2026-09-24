const supabase = require("../config/database");


// GET ALL REMINDERS
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
            console.error("GET REMINDER ERROR:", error);
            return res.status(400).json({
                message: error.message
            });
        }

        res.json(data);

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// ADD REMINDER
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
            console.error("ADD REMINDER ERROR:", error);
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(201).json({
            message: "Reminder added successfully",
            reminder: data
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE REMINDER STATUS
exports.updateReminder = async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("reminders")
            .update({
                status: "Completed"
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("UPDATE REMINDER ERROR:", error);
            return res.status(400).json({
                message: error.message
            });
        }

        res.json({
            message: "Reminder completed successfully",
            reminder: data
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
};