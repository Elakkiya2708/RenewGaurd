const express = require("express");

const {
    getReminders,
    addReminder,
    updateReminder
} = require("../controllers/reminderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getReminders
);

router.post(
    "/",
    authMiddleware,
    addReminder
);

router.put(
    "/:id",
    authMiddleware,
    updateReminder
);

module.exports = router;