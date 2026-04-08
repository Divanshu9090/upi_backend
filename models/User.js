const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: { type: String, unique: true },
  password: String,
  type: { type: String, enum: ["normal", "merchant"] },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
