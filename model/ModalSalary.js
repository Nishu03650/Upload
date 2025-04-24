const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    month: { type: String, required: true }, // e.g., "March 2025"
    totalHours: { type: Number, required: true, default: 0 },
    hourlyRate: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Salary', SalarySchema);
