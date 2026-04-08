const User = require("../models/User");
const Transaction = require("../models/Transaction");
const axios = require("axios");

// MULTI-MODEL FRAUD CHECK
async function checkFraudAllModels(data) {
  try {
    const [xgb, cat, lgb] = await Promise.all([
      axios.post("https://upi-predict-api.onrender.com/predictxt", data),
      axios.post("https://upi-predict-api.onrender.com/predictct", data),
      axios.post("https://upi-predict-api.onrender.com/predictlm", data),
    ]);

    const results = [xgb.data.fraud, cat.data.fraud, lgb.data.fraud];

    return results.includes(1);
  } catch (err) {
    console.error("ML API Error:", err.message);
    throw err;
  }
}

exports.makePayment = async (req, res) => {
  try {
    const senderId = req.params.userId;
    const { receiverPhone, category, amount } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ phone: receiverPhone });

    if (!receiver) return res.json({ error: "Receiver not found" });

    // BLOCK MERCHANT AS SENDER
    if (sender.type === "merchant") {
      return res.json({ error: "Merchant cannot send payments" });
    }

    if (sender.balance < amount) {
      return res.json({ error: "Insufficient balance" });
    }

    // ML INPUT DATA
    const mlData = {
      hour_of_day: new Date().getHours(),
      day_of_week: new Date().getDay(),
      sender_age: sender.age,
      receiver_age: receiver.age,
      merchant_category: category,
      amount: amount,
      receiver_upi: receiverPhone,
    };

    // CHECK FRAUD
    const isFraud = await checkFraudAllModels(mlData);

    // LOG TRANSACTION AS FRAUD if detected
    if (isFraud) {
      await Transaction.create({
        sender: sender._id,
        receiver: null,
        receiverInfo: {
          phone: receiver.phone,
          name: receiver.name,
        },
        amount,
        status: "failed",
        fraud: true,
      });

      return res.json({
        message: "Fraud detected 🚨 Transaction blocked",
      });
    }

    // PROCESS PAYMENT if not fraud
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    await Transaction.create({
      sender: sender._id,
      receiver: receiver._id,
      receiverInfo: {
        phone: receiver.phone,
        name: receiver.name,
      },
      amount,
      status: "success",
      fraud: false,
    });

    res.json({
      message: "Payment successful",
      balance: sender.balance,
      userId: sender._id,
    });
  } catch (err) {
    res.json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  const transactions = await Transaction.find({
    $or: [{ sender: req.params.userId }, { receiver: req.params.userId }],
  }).populate("sender receiver");

  res.json(transactions);
};
