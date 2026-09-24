const express = require("express");

const {
    getReport,
    downloadPDF
} = require("../controllers/reportController");

const router = express.Router();

router.get("/", getReport);

module.exports = router;