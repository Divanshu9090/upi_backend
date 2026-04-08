const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, age, phone, password, type } = req.body;

    const regex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;

    if (!regex.test(password)) {
      return res.json({
        error:
          "Password must contain 1 uppercase, 1 special char and min 6 length",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      age,
      phone,
      password: hashed,
      type,
    });

    res.json(user);
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });

    if (!user) return res.json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, type: user.type }, "secret123", {
      expiresIn: "1d",
    });

    res.json({
      token,
      user,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};
