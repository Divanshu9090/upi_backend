const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  receiverInfo: {
    phone: String,
    name: String,
  },

  amount: Number,
  status: String,
  fraud: Boolean,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
