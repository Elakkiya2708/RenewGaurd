const supabase = require("../config/database");

exports.getReport = async (req, res) => {
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

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = [];
        const expired = [];
        const renewed = [];

        data.forEach(item => {
            const expiry = new Date(item.expiry_date);

            if (item.status === "Renewed") {
                renewed.push(item);
            } else if (expiry < today) {
                expired.push(item);
            } else {
                upcoming.push(item);
            }
        });

        const totalCost = data.reduce(
            (sum, item) => sum + Number(item.cost || 0),
            0
        );

        res.json({
            total: data.length,
            upcoming: upcoming.length,
            expired: expired.length,
            renewed: renewed.length,
            totalCost,
            data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};