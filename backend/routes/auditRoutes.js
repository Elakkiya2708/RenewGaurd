const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    res.json({
        message: "Audit Logs API is working"
    });
});

module.exports = router;