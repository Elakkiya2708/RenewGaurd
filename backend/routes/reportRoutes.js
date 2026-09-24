const express = require("express");

const {
    getReport,
    downloadPDF,
    downloadExcel
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getReport);

router.get("/excel", authMiddleware, downloadExcel);

router.get("/pdf", authMiddleware, downloadPDF);

module.exports = router;