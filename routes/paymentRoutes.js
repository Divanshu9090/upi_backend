const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { makePayment, getHistory } = require("../controllers/paymentController");

const router = express.Router();

router.get("/history/:userId", getHistory);
router.post("/pay/:userId", authMiddleware, makePayment);

module.exports = router;
