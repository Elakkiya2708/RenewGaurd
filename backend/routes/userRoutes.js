const express = require("express");

const {
    getUsers,
    updateUserRole,
    deleteUser,
    getProfile,
    updateProfile,
    changePassword
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

const router = express.Router();


// Admin - User Management
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


// Logged-in User - Profile
router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);
router.put("/password", authMiddleware, changePassword);

module.exports = router;