const express = require("express");

const {
    getUsers,
    updateUserRole,
    deleteUser
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);

router.put("/:id/role", updateUserRole);

router.delete("/:id", deleteUser);

module.exports = router;