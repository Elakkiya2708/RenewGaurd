const express = require("express");

const {
    getReport,
    downloadPDF
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReport);

router.get("/pdf", downloadPDF);

module.exports = router;