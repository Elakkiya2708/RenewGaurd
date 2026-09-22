const supabase = require("../config/database");

exports.uploadDocument = async (req, res) => {
    try {
        const { renewal_id } = req.body;

        if (!renewal_id || !req.file) {
            return res.status(400).json({
                message: "Renewal and file are required"
            });
        }

        const { data, error } = await supabase
            .from("documents")
            .insert([{
                renewal_id,
                file_name: req.file.originalname,
                file_path: req.file.path,
                file_type: req.file.mimetype,
                file_size: req.file.size
            }])
            .select()
            .single();

        if (error) {
            return res.status(400).json({
                message: error.message
            });
        }

        res.status(201).json({
            message: "Document uploaded successfully",
            document: data
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};