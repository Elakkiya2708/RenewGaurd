const express = require("express");
const { getAuditLogs } = require("../controllers/auditController");
const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    adminOnly,
    getAuditLogs
);

module.exports = router;