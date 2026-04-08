const express = require("express");
const { addMoney, getUser } = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/details/:id", getUser);
router.post("/add-money", authMiddleware, addMoney);

module.exports = router;
