const express = require("express");

const {
    getReminders,
    addReminder,
    updateReminder
} = require("../controllers/reminderController");

const router = express.Router();

router.get("/", getReminders);
router.post("/", addReminder);

module.exports = router;