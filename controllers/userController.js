const User = require("../models/User");

exports.addMoney = async (req, res) => {
  try {
    const { userId, amount } = req.body;

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

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
