const express = require("express");
const { getRenewals } = require("../controllers/renewalController");

const router = express.Router();

router.get("/", getRenewals);

module.exports = router;