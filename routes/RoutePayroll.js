const express = require("express");
const Payroll = require("../model/ModalPayroll"); // ✅ Correct Import
const Emp = require("../model/ModalEmployee");
const ModelLeave = require("../model/ModelLeave");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/add", (req, res) => {
    console.log("Incoming Request:", req.body);

    // Validate empId before using it
    if (!req.body.empId || req.body.empId.length !== 24) {
        return res.status(400).json({ error: "Invalid empId. Must be a 24-character MongoDB ObjectId." });
    }

    const payroll = new Payroll({
        empId: new mongoose.Types.ObjectId(req.body.empId),
        salary: req.body.salary,
        HRA: req.body.HRA,
        ca: req.body.ca,
        ma: req.body.ma,
        ba: req.body.ba,
        totalsalary: req.body.totalsalary,
        professionaltext: req.body.professionaltext,
        incometax: req.body.incometax,
        providentfund: req.body.providentfund,
        regularrate: req.body.regularrate,
        hourlyrate: req.body.hourlyrate,
        bankname: req.body.bankname,
        accountno: req.body.accountno,
        ifsccode: req.body.ifsccode,
        pan: req.body.pan,
        netsalary: req.body.netsalary,
        totalDeductions: req.body.totalDeductions,
        yearlyLeave: req.body.yearlyLeave,
        monthlyLeave: req.body.monthlyLeave,
        profile: ""
    });

    payroll.save()
        .then(() => res.send("Inserted Successfully"))
        .catch((error) => {
            console.error("Error inserting payroll:", error);
            res.status(500).send("NOT Inserted - " + error.message);
        });
});

router.get("/", async (req, res) => {
    try {
        const payrolls = await Payroll.find().populate("empId", "firstname lastname profile"); // ✅ Populate Employee Data

        const payrollWithEmployee = payrolls.map((payroll) => ({
            ...payroll.toObject(),
            employee: payroll.empId
                ? {
                    firstname: payroll.empId.firstname || "",
                    lastname: payroll.empId.lastname || "",
                    profile: payroll.empId.profile || ""
                }
                : { firstname: "Unknown", lastname: "", profile: "" }
        }));

        res.json(payrollWithEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ Get Employee By Id API (GET)
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        const data = await Payroll.find({ _id: req.params.id });
        res.send(data[0]);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});

router.get("/emp/:id", async (req, res) => {
    try {
        const payroll = await Payroll.findOne({ "empId": req.params.id });
        if (!payroll) {
            return res.status(404).json({ message: "Payroll not found" });
        }
        res.json(payroll);
    } catch (err) {
        console.error("Error fetching payroll:", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/calculate-salary/:empId', async (req, res) => {
    try {
        const { empId } = req.params;

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-indexed for Date constructor

        // Generate proper date range (start to end of current month)
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

        // Fetch Payroll Data
        const payroll = await ModelPayroll.findOne({ empId });

        if (!payroll) {
            return res.status(404).send("Payroll data not found");
        }

        let { netsalary, monthlyLeave, yearlyLeave, salary, hourlyrate } = payroll;

        // Fetch Leave Data for the Current Month
        const leaves = await ModelLeave.find({
            empId,
            StartDate: { $gte: startOfMonth, $lte: endOfMonth }
        });

        let totalLeaveDays = 0;
        let totalHalfDays = 0;

        leaves.forEach(leave => {
            let startDate = new Date(leave.StartDate);
            let endDate = new Date(leave.EndDate);
            let leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            if (leave.LeaveType === "Half Day") {
                totalHalfDays += 0.5;
            } else {
                totalLeaveDays += leaveDays;
            }
        });

        // Calculate Extra Leaves
        let extraFullLeaves = totalLeaveDays > 2 ? totalLeaveDays - 2 : 0;
        let extraHalfLeaves = totalHalfDays > 1 ? totalHalfDays - 1 : 0;
        let totalExtraLeaveDays = extraFullLeaves + (extraHalfLeaves * 0.5);

        let perDaySalary = salary / 30;
        let leaveDeduction = totalExtraLeaveDays * perDaySalary;

        // Update Yearly Leave (non-negative)
        let updatedYearlyLeave = Math.max(0, yearlyLeave - totalExtraLeaveDays);

        // Fetch Attendance for Overtime
        const attendanceRecords = await ModelAttendance.find({
            empId,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        let totalOvertimeHours = 0;

        attendanceRecords.forEach(record => {
            let workHours = record.totalHours || 0;
            if (workHours > 8) {
                totalOvertimeHours += (workHours - 8);
            }
        });

        let overtimePay = totalOvertimeHours * hourlyrate;

        // Final Net Salary
        let finalNetSalary = netsalary - leaveDeduction + overtimePay;

        // Update Payroll
        await ModelPayroll.updateOne(
            { empId },
            {
                $set: {
                    netsalary: finalNetSalary,
                    monthlyLeave: Math.max(0, monthlyLeave - totalExtraLeaveDays),
                    yearlyLeave: updatedYearlyLeave
                }
            }
        );

        res.json({
            empId,
            totalLeavesTaken: totalLeaveDays + totalHalfDays,
            extraLeavesDeducted: totalExtraLeaveDays,
            updatedYearlyLeave,
            leaveDeduction,
            overtimePay,
            finalNetSalary
        });

    } catch (err) {
        console.error("Error calculating salary:", err);
        res.status(500).send("Error calculating salary: " + err.message);
    }
});


// router.get('/calculate-salary/:empId', async (req, res) => {
//     try {
//         const { empId } = req.params;
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed

//         // Fetch Payroll Data
//         const payroll = await ModelPayroll.findOne({ empId });

//         if (!payroll) {
//             return res.status(404).send("Payroll data not found");
//         }

//         let { netsalary, monthlyLeave, yearlyLeave, salary, hourlyrate, regularrate } = payroll;

//         // Fetch Leave Data for the Current Month
//         const leaves = await ModelLeave.find({
//             empId,
//             StartDate: {
//                 $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`),
//                 $lte: new Date(`${currentYear}-${currentMonth}-31T23:59:59.999Z`)
//             }
//         });

//         let totalLeaveDays = 0;
//         let totalHalfDays = 0;

//         leaves.forEach(leave => {
//             let startDate = new Date(leave.StartDate);
//             let endDate = new Date(leave.EndDate);
//             let leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

//             if (leaveDays === 0) leaveDays = 1; // Single day leave

//             if (leave.LeaveType === "Half Day") {
//                 totalHalfDays += 0.5;
//             } else {
//                 totalLeaveDays += leaveDays;
//             }
//         });

//         // Total Leave Deduction Calculation
//         let extraFullLeaves = totalLeaveDays > 2 ? totalLeaveDays - 2 : 0;
//         let extraHalfLeaves = totalHalfDays > 1 ? totalHalfDays - 1 : 0;
//         let totalExtraLeaveDays = extraFullLeaves + (extraHalfLeaves * 0.5);

//         let perDaySalary = salary / 30; // Assuming 30 days in a month
//         let leaveDeduction = totalExtraLeaveDays * perDaySalary;

//         // Fetch Overtime Data (Example: Fetch from Attendance Collection)
//         const attendanceRecords = await ModelAttendance.find({
//             empId,
//             date: {
//                 $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`),
//                 $lte: new Date(`${currentYear}-${currentMonth}-31T23:59:59.999Z`)
//             }
//         });

//         let totalOvertimeHours = 0;

//         attendanceRecords.forEach(record => {
//             let workHours = record.totalHours; // Assuming totalHours field stores worked hours
//             if (workHours > 8) {
//                 totalOvertimeHours += workHours - 8; // Count only extra hours
//             }
//         });

//         let overtimePay = totalOvertimeHours * hourlyrate;

//         // Final Net Salary Calculation
//         let finalNetSalary = netsalary - leaveDeduction + overtimePay;

//         // Update Payroll Data
//         await ModelPayroll.updateOne(
//             { empId },
//             {
//                 $set: {
//                     netsalary: finalNetSalary,
//                     monthlyLeave: Math.max(0, monthlyLeave - totalExtraLeaveDays),
//                     yearlyLeave: Math.max(0, yearlyLeave - totalExtraLeaveDays)
//                 }
//             }
//         );

//     } catch (err) {
//         console.error("Error calculating salary:", err);
//         res.status(500).send("Error calculating salary: " + err);
//     }
// });


// router.get('/calculate-salary/:empId', async (req, res) => {
//     try {
//         const { empId } = req.params;
//         const currentYear = new Date().getFullYear();
//         const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed

//         // Fetch Payroll Data
//         const payroll = await ModelPayroll.findOne({ empId });

//         if (!payroll) {
//             return res.status(404).send("Payroll data not found");
//         }

//         let { netsalary, monthlyLeave, yearlyLeave, salary, hourlyrate, regularrate } = payroll;

//         // Fetch Leave Data for the Current Month
//         const leaves = await ModelLeave.find({
//             empId,
//             StartDate: {
//                 $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`),
//                 $lte: new Date(`${currentYear}-${currentMonth}-31T23:59:59.999Z`)
//             }
//         });

//         let totalLeaveDays = 0;
//         let totalHalfDays = 0;

//         leaves.forEach(leave => {
//             let startDate = new Date(leave.StartDate);
//             let endDate = new Date(leave.EndDate);
//             let leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

//             if (leaveDays === 0) leaveDays = 1; // Single day leave

//             if (leave.LeaveType === "Half Day") {
//                 totalHalfDays += 0.5;
//             } else {
//                 totalLeaveDays += leaveDays;
//             }
//         });

//         // Total Leave Deduction Calculation
//         let extraFullLeaves = totalLeaveDays > 2 ? totalLeaveDays - 2 : 0;
//         let extraHalfLeaves = totalHalfDays > 1 ? totalHalfDays - 1 : 0;
//         let totalExtraLeaveDays = extraFullLeaves + (extraHalfLeaves * 0.5);

//         let perDaySalary = salary / 30; // Assuming 30 days in a month
//         let leaveDeduction = totalExtraLeaveDays * perDaySalary;

//         // **UPDATE: Deduct extra leaves from yearly leave balance**
//         let updatedYearlyLeave = Math.max(0, yearlyLeave - totalExtraLeaveDays);

//         // Fetch Overtime Data (Example: Fetch from Attendance Collection)
//         const attendanceRecords = await ModelAttendance.find({
//             empId,
//             date: {
//                 $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`),
//                 $lte: new Date(`${currentYear}-${currentMonth}-31T23:59:59.999Z`)
//             }
//         });

//         let totalOvertimeHours = 0;

//         attendanceRecords.forEach(record => {
//             let workHours = record.totalHours; // Assuming totalHours field stores worked hours
//             if (workHours > 8) {
//                 totalOvertimeHours += workHours - 8; // Count only extra hours
//             }
//         });

//         let overtimePay = totalOvertimeHours * hourlyrate;

//         // Final Net Salary Calculation
//         let finalNetSalary = netsalary - leaveDeduction + overtimePay;

//         // Update Payroll Data with yearly leave adjustment
//         await ModelPayroll.updateOne(
//             { empId },
//             {
//                 $set: {
//                     netsalary: finalNetSalary,
//                     monthlyLeave: Math.max(0, monthlyLeave - totalExtraLeaveDays),
//                     yearlyLeave: updatedYearlyLeave // **Yearly leave updated**
//                 }
//             }
//         );

//         res.json({
//             empId,
//             totalLeavesTaken: totalLeaveDays + totalHalfDays,
//             extraLeavesDeducted: totalExtraLeaveDays,
//             updatedYearlyLeave,
//             leaveDeduction,
//             overtimePay,
//             finalNetSalary
//         });

//     } catch (err) {
//         console.error("Error calculating salary:", err);
//         res.status(500).send("Error calculating salary: " + err);
//     }
// });

// ➤ Update Employee API (PUT)

router.put('/update/:id', (req, res) => {
    Payroll.updateOne(
        { _id: req.params['id'] },
        { $set: req.body }
    )
        .then((result) => {
            res.send("Updated Successfully");
        })
        .catch((err) => res.status(500).send("Error updating: " + err));
});

// ➤ Delete Employee API (DELETE) - UPDATED
router.delete('/delete/:id', async (req, res) => {
    try {
        const payroll = await Payroll.findById(req.params.id);
        if (!payroll) {
            return res.status(404).send("Payroll not found");
        }

        await Payroll.deleteOne({ _id: req.params.id });
        res.send("Deleted Successfully");
    } catch (err) {
        res.status(500).send("Error deleting: " + err.message);
    }
});

module.exports = router;
