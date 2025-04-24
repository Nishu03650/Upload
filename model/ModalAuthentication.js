const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },  // ✅ Email field add kiya
  otp: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 600 } // ✅ OTP Expiry
});

module.exports = mongoose.model("Employee", employeeSchema);
