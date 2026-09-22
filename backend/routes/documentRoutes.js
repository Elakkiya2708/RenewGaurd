const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { uploadDocument } = require("../controllers/documentController");

const router = express.Router();

router.post("/", upload.single("file"), uploadDocument);

module.exports = router;