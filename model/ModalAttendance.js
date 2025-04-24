
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" }, // Reference to addemp collection,
  checkin: String,
  checkout: String,
  date: String,
  status: String,
  
  
  totalHours: {
    type: Number,
    default: 0
  },
}, { timestamps: true }
);

// Ensure the collection name is correct
const Attendance = mongoose.model("attendance", attendanceSchema); // Third param ensures the correct collection name
// const Customer = mongoose.model('Customer', userSchema,'customer');
module.exports = Attendance;
