const express = require("express");

const {
    getRenewals,
    addRenewal,
    updateRenewal,
    deleteRenewal
} = require("../controllers/renewalController");

const router = express.Router();

router.get("/", getRenewals);
router.post("/", addRenewal);
router.put("/:id", updateRenewal);
router.delete("/:id", deleteRenewal);

module.exports = router;