const express = require("express");

const {
    getUsers,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    adminOnly,
    getUsers
);

router.put(
    "/:id/role",
    authMiddleware,
    adminOnly,
    updateUserRole
);

router.delete(
    "/:id",
    authMiddleware,
    adminOnly,
    deleteUser
);

module.exports = router;