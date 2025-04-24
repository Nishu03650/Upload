const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  mobileNo: Number,
  email: { type: String } ,  // ✅ Email field add kiya
  otp: { type: String },
  gender: String,
  maritalStatus: String,
  // designation:String,
  mobileNo: { type: Number, required: true }, // ✅ Ensure required field
  email: { type: String, required: true },  // ✅ Ensure required field
  designation: { type: String, required: true },  // ✅ Ensure required field
  department: { type: mongoose.Schema.Types.ObjectId, ref: "department" },
  employeeType: { type: String, enum: ["hr", "employee"] }, // ✅ Added
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'department' },
  birthdate:Date,
  joiningdate:Date,
  nationality:String,
  zip:Number,
  address:String,
  profile:String,
  shift: { type: mongoose.Schema.Types.ObjectId, ref: "shifts" },
  
});

// Model create
const Emp = mongoose.model("employee", empSchema, "employee");

module.exports = Emp;
