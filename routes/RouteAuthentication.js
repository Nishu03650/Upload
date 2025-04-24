const express = require("express");
const router = express.Router();
// import axios from "axios";
const ModalEmployee = require("../model/ModalEmployee"); // ✅ Proper Model Import
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Email Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nishu03650@gmail.com", 
    pass: "fbya ftsv vvzq wqci",
  },
  tls: {
    rejectUnauthorized: false, // ✅ Ignore SSL errors
  }
});

// 🎯 Send authentication API
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required!" });

  const otp = crypto.randomInt(100000, 999999).toString(); // ✅ OTP variable (Fix)

  await ModalEmployee.findOneAndUpdate({ email }, { otp }, { upsert: true, new: true }); // ✅ Corrected model name & otp field

  // Send Email
  const mailOptions = {
    from: "nishu03650@gmail.com",
    to: email,
    subject: "Your otp Code",
    text: `Your otp code is: ${otp}. This will expire in 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Email Send Error:", err); // 👀 Error Print
      return res.status(500).json({ error: "Failed to send otp!", details: err.message });
    }
    res.json({ message: "otp Sent Successfully!" });
    
    
  });
});

// 🎯 Verify authentication API
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body; // ✅ "otp" field matching the schema

  console.log("User entered otp:", otp);

  const userRecord= await ModalEmployee.findOne({ email, otp }); // ✅ Corrected query

  if (!userRecord) {
    console.log("Invalid otp for:", email);
    return res.status(400).json({ error: "Invalid otp" });
  }

  res.json({ message: "OTP verified successfully!",user:userRecord });
});

module.exports = router;
