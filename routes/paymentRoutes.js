const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { makePayment, getHistory } = require("../controllers/paymentController");

const router = express.Router();

router.get("/history", authMiddleware, getHistory);
router.post("/pay", authMiddleware, makePayment);

module.exports = router;
