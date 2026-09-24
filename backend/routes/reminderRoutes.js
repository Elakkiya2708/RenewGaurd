const express = require("express");

const {
    getReminders,
    addReminder,
    updateReminder
} = require("../controllers/reminderController");

const router = express.Router();

router.get("/", getReminders);
router.post("/", addReminder);
router.put("/:id", updateReminder);

module.exports = router;