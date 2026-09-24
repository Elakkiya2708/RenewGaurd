const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
    uploadDocument,
    getDocuments,
    downloadDocument,
    deleteDocument
} = require("../controllers/documentController");

const router = express.Router();



router.post("/", authMiddleware, upload.single("file"), uploadDocument);

router.get("/", authMiddleware, getDocuments);

router.get("/download/:id", authMiddleware, downloadDocument);

router.delete("/:id", authMiddleware, deleteDocument);

module.exports = router;