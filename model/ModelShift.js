const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
 name: String,
 start_time: String,
 end_time: String,
 totalHours: Number  


});

// Ensure the collection name is correct
const ModelShift = mongoose.model("Shift", ShiftSchema); // Third param ensures the correct collection name
// const Customer = mongoose.model('Customer', userSchema,'customer');
module.exports =ModelShift;