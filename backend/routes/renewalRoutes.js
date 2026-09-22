const express = require("express");

const {
    getRenewals,
    addRenewal
} = require("../controllers/renewalController");

const router = express.Router();

router.get("/", getRenewals);

router.post("/", addRenewal);

module.exports = router;