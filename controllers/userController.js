const User = require("../models/User");

exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Invalid amount",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ error: "User not found" });
    }

    if (user.type === "merchant") {
      return res.json({ error: "Merchant cannot add money" });
    }

    user.balance += amount;

    await user.save();

    res.json({
      message: "Money added",
      balance: user.balance,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
