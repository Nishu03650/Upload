const mongoose = require("mongoose");

const HolidaySchema = new mongoose.Schema({
  Date:Date,
  Days: String,
  Holidayname: String,
});

// Model create
const Holiday = mongoose.model("Holiday", HolidaySchema, "Holiday");

module.exports = Holiday;