const supabase = require("../config/database");
const { createPDF } = require("../services/reportService");
const ExcelJS = require("exceljs");
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

exports.downloadExcel = async (req, res) => {
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Renewals");

        worksheet.columns = [
            { header: "Name", key: "name", width: 25 },
            { header: "Category", key: "category", width: 18 },
            { header: "Organization", key: "organization", width: 22 },
            { header: "Start Date", key: "start_date", width: 15 },
            { header: "Expiry Date", key: "expiry_date", width: 15 },
            { header: "Cost", key: "cost", width: 12 },
            { header: "Priority", key: "priority", width: 12 },
            { header: "Status", key: "status", width: 15 },
            { header: "Notes", key: "notes", width: 30 }
        ];

        data.forEach(item => {
            worksheet.addRow({
                name: item.name || "",
                category: item.category || "",
                organization: item.organization || "",
                start_date: item.start_date || "",
                expiry_date: item.expiry_date || "",
                cost: Number(item.cost || 0),
                priority: item.priority || "",
                status: item.status || "",
                notes: item.notes || ""
            });
        });

        worksheet.getRow(1).font = {
            bold: true
        };

        worksheet.getRow(1).alignment = {
            horizontal: "center"
        };

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=RenewGuard_Report.xlsx"
        );

        await workbook.xlsx.write(res);

        res.end();

    } catch (error) {
        console.error("Excel Error:", error);

        res.status(500).json({
            message: "Excel generation failed"
        });
    }
};