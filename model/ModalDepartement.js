
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: String,  
});

const ModelDepartment = mongoose.model("department", departmentSchema);
module.exports = ModelDepartment;


