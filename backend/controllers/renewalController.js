const supabase = require("../config/database");

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