const express = require("express");
const { addMoney, getProfile } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.post("/add-money", authMiddleware, addMoney);

module.exports = router;
