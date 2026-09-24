const express = require("express");

const {
    getReport,
    downloadPDF,
    downloadExcel
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReport);
router.get("/excel", downloadExcel);
router.get("/pdf", downloadPDF);

module.exports = router;