const express = require("express");

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
    uploadDocument
} = require("../controllers/documentController");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    upload.single("file"),
    uploadDocument
);

module.exports = router;