const express = require("express");

const {
    getReminders,
    addReminder
} = require("../controllers/reminderController");

const router = express.Router();

router.get("/", getReminders);
router.post("/", addReminder);

module.exports = router;