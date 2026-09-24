const supabase = require("../config/database");
const { createPDF } = require("../services/reportService");
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

        const categories = {};

        data.forEach(item => {

            const expiry = new Date(item.expiry_date);

            // Status based classification
            if (item.status === "Renewed") {
                renewed.push(item);
            } 
            else if (item.status === "Expired" || expiry < today) {
                expired.push(item);
            } 
            else {
                upcoming.push(item);
            }

            // Category summary
            if (!categories[item.category]) {
                categories[item.category] = {
                    count: 0,
                    cost: 0
                };
            }

            categories[item.category].count += 1;
            categories[item.category].cost += Number(item.cost || 0);
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
            categories,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

exports.downloadPDF = async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("renewals")
            .select("*")
            .order("expiry_date", {
                ascending: true
            });

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        createPDF(res, data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "PDF generation failed"
        });
    }
};