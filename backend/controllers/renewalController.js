const supabase = require("../config/database");
const { createDefaultReminders } = require("../services/reminderService");
exports.getRenewals = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("renewals")
            .select("*")
            .order("expiry_date", { ascending: true });

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json(data);

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};


exports.addRenewal = async (req, res) => {
    try {

        const {
            name,
            category,
            organization,
            start_date,
            expiry_date,
            cost,
            priority,
            status,
            notes
        } = req.body;

        if (!name || !category || !expiry_date) {
            return res.status(400).json({
                message: "Name, category and expiry date are required"
            });
        }

        const { data, error } = await supabase
            .from("renewals")
            .insert([{
                name,
                category,
                organization,
                start_date: start_date || null,
                expiry_date,
                cost: cost || 0,
                priority: priority || "Medium",
                status: status || "Pending",
                notes
            }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }
        await createDefaultReminders(data.id, data.expiry_date);

        res.status(201).json({
            message: "Renewal added successfully",
            renewal: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.updateRenewal = async (req, res) => {
    try {
        const { id } = req.params;

        // Get old renewal data
        const { data: oldData, error: oldError } = await supabase
            .from("renewals")
            .select("*")
            .eq("id", id)
            .single();

        if (oldError) {
            return res.status(400).json({
                message: oldError.message
            });
        }

        // Update renewal
        const { data, error } = await supabase
            .from("renewals")
            .update(req.body)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        // Save history when status changes
        if (
            req.body.status &&
            req.body.status !== oldData.status
        ) {
            const { error: historyError } = await supabase
                .from("renewal_history")
                .insert([{
                    renewal_id: id,
                    action: "Status Changed",
                    old_status: oldData.status,
                    new_status: req.body.status,
                    remarks: req.body.notes || null
                }]);

            if (historyError) {
                console.error("History Error:", historyError);
            }
        }

        res.json({
            message: "Renewal updated successfully",
            renewal: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.deleteRenewal = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("renewals")
            .delete()
            .eq("id", id);

        if (error) {
            return res.status(400).json({ message: error.message });
        }

        res.json({
            message: "Renewal deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};