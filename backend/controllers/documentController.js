const supabase = require("../config/database");
const fs = require("fs");


// ===============================
// UPLOAD DOCUMENT
// ===============================

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
                renewal_id: renewal_id,
                file_name: req.file.originalname,
                file_path: req.file.path,
                file_type: req.file.mimetype,
                file_size: req.file.size
            }])
            .select()
            .single();

        if (error) {
            console.error(error);

            return res.status(400).json({
                message: error.message
            });
        }

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


// ===============================
// GET ALL DOCUMENTS
// ===============================

exports.getDocuments = async (req, res) => {
    try {

        const { data: documents, error } = await supabase
            .from("documents")
            .select("*")
            .order("uploaded_at", {
                ascending: false
            });

        if (error) {
            console.error("GET DOCUMENTS ERROR:", error);

            return res.status(400).json({
                message: error.message
            });
        }

        const { data: renewals, error: renewalError } =
            await supabase
                .from("renewals")
                .select("id, name");

        if (renewalError) {
            console.error(
                "GET RENEWALS ERROR:",
                renewalError
            );

            return res.status(400).json({
                message: renewalError.message
            });
        }

        const result = documents.map(document => {

            const renewal = renewals.find(
                item => item.id == document.renewal_id
            );

            return {
                ...document,
                renewals: {
                    name: renewal
                        ? renewal.name
                        : "Unknown Renewal"
                }
            };

        });

        res.json(result);

    } catch (error) {

        console.error(
            "GET DOCUMENTS ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ===============================
// DOWNLOAD DOCUMENT
// ===============================

exports.downloadDocument = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {

            return res.status(404).json({
                message: "Document not found"
            });
        }

        if (!fs.existsSync(data.file_path)) {

            return res.status(404).json({
                message: "File not found on server"
            });
        }

        res.download(
            data.file_path,
            data.file_name
        );

    } catch (error) {

        console.error("DOWNLOAD ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ===============================
// DELETE DOCUMENT
// ===============================

exports.deleteDocument = async (req, res) => {

    try {

        const { id } = req.params;

        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .eq("id", id)
            .single();

        if (error || !data) {

            return res.status(404).json({
                message: "Document not found"
            });
        }


        // Delete physical file

        if (fs.existsSync(data.file_path)) {

            fs.unlinkSync(data.file_path);

        }


        // Delete database record

        const { error: deleteError } = await supabase
            .from("documents")
            .delete()
            .eq("id", id);

        if (deleteError) {

            return res.status(400).json({
                message: deleteError.message
            });
        }


        res.json({
            message: "Document deleted successfully"
        });

    } catch (error) {

        console.error("DELETE DOCUMENT ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};