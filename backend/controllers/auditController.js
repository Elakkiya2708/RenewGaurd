const supabase = require("../config/database");

exports.getAuditLogs = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("audit_logs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};