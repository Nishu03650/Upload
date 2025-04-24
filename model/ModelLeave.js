const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
    empId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" }, 
    // employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  LeaveType: String,
  StartDate: Date,
  EndDate: Date,
  Noofday:Number,
  Days:String,
  Reason:String, 
  Status:String,
  // profile:String,
});

// Model create
const Leave = mongoose.model("Leave", LeaveSchema, "Leave");

module.exports = Leave;
