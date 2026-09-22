const supabase = require("../config/database");

exports.uploadDocument = async (req, res) => {
    try {
        console.log("Upload request received");

        const { renewal_id } = req.body;

        console.log("Renewal ID:", renewal_id);
        console.log("File:", req.file);

        if (!renewal_id || !req.file) {
            return res.status(400).json({
                message: "Renewal and file are required"
            });
        }

        const { data, error } = await supabase
            .from("documents")
            .insert([{
                renewal_id: renewal_id,
                file_name: req.file.originalname,
                file_path: req.file.path,
                file_type: req.file.mimetype,
                file_size: req.file.size
            }])
            .select()
            .single();

        if (error) {
            console.error("SUPABASE DOCUMENT ERROR:", error);

            return res.status(400).json({
                message: error.message
            });
        }

        console.log("Document saved successfully:", data);

        res.status(201).json({
            message: "Document uploaded successfully!",
            document: data
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};