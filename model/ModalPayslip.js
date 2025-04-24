// const mongoose = require("mongoose");

// const payslipSchema = new mongoose.Schema({
//     employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee", required: true },
//     salary: Number,
//     deductions: Number,
//     netPay: Number,
//     month: String,
//     year: Number,
// });

// const Payslip = mongoose.model("payslip", payslipSchema);
// module.exports = Payslip;

const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, // Employee reference
    basicSalary: { type: Number, required: true },
    hra: { type: Number, required: true },
    allowances: { type: Number, required: true },
    deductions: { type: Number, required: true },
    netSalary: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payslip", payslipSchema);
