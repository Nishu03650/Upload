const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" }, // Reference to addemp collection
  salary: Number,
  HRA:Number,
  ca: Number,
  ma: Number,
  ba: Number,
  totalsalary:Number,
  professionaltext: Number,
  incometax: Number,
  providentfund: Number,
  regularrate:Number,
  hourlyrate: Number,
  bankname:String,
  accountno:String,
  ifsccode:String,
  pan:String,
  netsalary:Number,
  totalDeductions:Number,
  monthlyLeave:Number,
  yearlyLeave:Number,
});

// Model create
const Payroll = mongoose.model("Payroll", payrollSchema, "payroll");

module.exports = Payroll;
