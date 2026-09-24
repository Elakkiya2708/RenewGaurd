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


// Upload
router.post(
    "/",
    authMiddleware,
    upload.single("file"),
    uploadDocument
);


// Get all documents
router.get(
    "/",
    authMiddleware,
    getDocuments
);


// Download
router.get(
    "/download/:id",
    authMiddleware,
    downloadDocument
);


// Delete
router.delete(
    "/:id",
    authMiddleware,
    deleteDocument
);


module.exports = router;