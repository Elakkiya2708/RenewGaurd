const express = require("express");

const {
    getRenewals,
    addRenewal,
    updateRenewal,
    deleteRenewal
} = require("../controllers/renewalController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getRenewals
);

router.post(
    "/",
    authMiddleware,
    addRenewal
);

router.put(
    "/:id",
    authMiddleware,
    updateRenewal
);

router.delete(
    "/:id",
    authMiddleware,
    deleteRenewal
);

module.exports = router;