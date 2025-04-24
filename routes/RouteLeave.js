// const express = require("express");
// const mongoose = require("mongoose");
// const ModelLeave = require("../model/ModelLeave");
// const ModalPayroll = require("../model/ModalPayroll");
// const Emp = require("../model/ModalEmployee");
// const router = express.Router();

// router.post("/add", async (req, res) => {
//     try {
//         const employee = await Emp.findById(req.body.empId);
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         const newLeave = new ModelLeave({
//             empId: employee._id, // Use existing employee ID
//             LeaveType: req.body.LeaveType,
//             StartDate: req.body.StartDate,
//             EndDate: req.body.EndDate,
//             Noofday: req.body.Noofday,
//             Days: req.body.Days,
//             Reason: req.body.Reason,
//             Status: req.body.Status,
//             profile: String,
//         });

//         await newLeave.save();
//         res.status(201).json({ message: "Leave added successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Error saving leave data", error: error.message });
//     }
// });

// router.get("/", async (req, res) => {
//     try {
//         const leaves = await ModelLeave.find().populate("empId", "firstname lastname profile");

//         const leavesWithEmployee = leaves.map((leave) => ({
//             ...leave.toObject(),
//             employee: leave.empId
//                 ? {
//                     firstname: leave.empId.firstname || "",
//                     lastname: leave.empId.lastname || "",
//                     profile: leave.empId.profile || ""  // ✅ Profile ઉમેર્યું
//                 }
//                 : { firstname: "Unknown", lastname: "", profile: "" }
//         }));

//         res.json(leavesWithEmployee);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ➤ Get Employee By Id API (GET)
// router.get('/:id', async (req, res) => {
//     try {
//         const data = await ModelLeave.find({ _id: req.params.id });
//         res.send(data[0]);
//     } catch (err) {
//         res.status(500).send("Error: " + err);
//     }
// });

// router.get('/user/:id', async (req, res) => {
//     try {
//         const data = await ModelLeave.find({ empId: req.params.id });
//         res.send(data);
//     } catch (err) {
//         res.status(500).send("Error: " + err);
//     }
// });


// router.get("/approved-leave-count", async (req, res) => {
//     try {
//         const approvedLeaves = await ModelLeave.find({ Status: "Approved" });

//         let leaveCount = {};

//         approvedLeaves.forEach(leave => {
//             const days = leave.Noofday || 0; // Ensure it accounts for leave duration
//             leaveCount[leave.empId] = (leaveCount[leave.empId] || 0) + days;
//         });

//         res.json(leaveCount);
//     } catch (error) {
//         console.error("Error fetching approved leave count:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// });

// // router.get("/employee/:id", async (req, res) => {
// //     try {
// //         const leaves = await ModelLeave.find({ empId: req.params.id });
// //         res.json(leaves);
// //     } catch (err) {
// //         res.status(500).json({ error: err.message });
// //     }
// // });
// router.get("/employee/:id", async (req, res) => {
//     console.log("🔍 Request received for Employee ID:", req.params.id);

//     try {
//         const employee = await Emp.findById(req.params.id);
//         if (!employee) {
//             return res.status(404).json({ message: "❌ Employee not found" });
//         }
//         console.log("✅ Employee Found:", employee);
//         res.json(employee);
//     } catch (err) {
//         console.error("❌ Error fetching employee:", err);
//         res.status(500).json({ error: "Server Error", details: err.message });
//     }
// });



// router.get("/lc/:employeeId", async (req, res) => {
//     try {
        
//         const { month, year } = req.query;

        

//         // Convert month and year to Date range
//         const startDate = new Date(year, month - 1, 1);
//         const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month

//         // Fetch leaves within the specified month and year
//         const leaves = await ModelLeave.find({
//             empId:new mongoose.Types.ObjectId(req.params['employeeId']),
//             StartDate: { $gte: startDate, $lte: endDate },
//         });

//         // Calculate total leave days
//         const totalLeaveDays = leaves.reduce((sum, leave) => sum + (leave.Noofday || 0), 0);

//         res.json(leaves.length);
//     } catch (error) {
//         console.error("Error fetching leave count:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// });

// // router.get("/leave-count", async (req, res) => {
// //     try {
// //         const { employeeId, month, year } = req.query;
        
// //         if (!employeeId || !month || !year) {
// //             return res.status(400).json({ message: "Missing required query parameters" });
// //         }

// //         // Convert month and year to Date range
// //         const startDate = new Date(year, month - 1, 1);
// //         const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month

// //         // Fetch leaves within the specified month and year
// //         const leaves = await ModelLeave.find({
// //             empId: mongoose.Types.ObjectId(employeeId),
// //             StartDate: { $gte: startDate, $lte: endDate },
// //         });

// //         // Calculate total leave days
// //         const totalLeaveDays = leaves.reduce((sum, leave) => sum + (leave.Noofday || 0), 0);

// //         res.json(leaves.length);
// //     } catch (error) {
// //         console.error("Error fetching leave count:", error);
// //         res.status(500).json({ message: "Server Error", error: error.message });
// //     }
// // });

// // router.get("/leave-count", async (req, res) => {
// //     console.log("vhjvcjvacac");
// //     try {
       
// //         console.log("Query Params:", req.query); // Debugging purpose

// //         // const { employeeId, month, year } = req.query;

// //         // if (!mongoose.Types.ObjectId.isValid(employeeId)) {
// //         //     return res.status(400).json({ error: "Invalid Employee ID" });
// //         // }

// //         // const leaveCount = await LeaveModel.find({ employeeId, month, year }).count();
// //         // res.json(leaveCount);
// //     } catch (error) {
// //         console.error("Error fetching leave count:", error);
// //         res.status(500).json({ error: "Internal Server Error" });
// //     }
// // });






// //API to fetch leave data and apply deduction logic

// router.get("/leave", async (req, res) => {
//     try {
//       const { employeeId, month, year } = req.query;
  
//       // Find leaves for the given employee and month
//       const leaves = await ModelLeave.find({ employeeId, month, year });
  
//       // Calculate total leaves taken
//       const totalLeavesTaken = leaves.reduce((sum, leave) => sum + leave.days, 0);
  
//       // Fetch Employee salary
//     //   const employee = await Employee.findById(employeeId);
//     //   const salary = employee ? employee.salary : 0;
  
//       // Apply Leave Deduction Logic
//       let extraLeaveDeduction = 0;
//       const allowedLeaves = 2; // Now allowing only 2 leaves
//       if (totalLeavesTaken > allowedLeaves) {
//         const extraLeaves = totalLeavesTaken - allowedLeaves;
//         const perDaySalary = salary / 30;
//         extraLeaveDeduction = extraLeaves * perDaySalary;
//       }
  
//       res.json({ totalLeaves: totalLeavesTaken, extraLeaveDeduction });
//     } catch (error) {
//       console.error("Error fetching leave data:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
// });
  

// // ➤ Update Leave API (PUT)
// router.put('/update/:id', (req, res) => {
//     ModelLeave.updateOne(
//         { _id: req.params['id'] },
//         { $set: req.body }
//     )
//         .then((result) => {
//             res.send("Updated Successfully");
//         })
//         .catch((err) => res.status(500).send("Error updating: " + err));
// });


// router.put('/status/:id/:status', async (req, res) => {
//     try {
//         const { id, status } = req.params;

//         // Update the leave status
//         await ModelLeave.updateOne(
//             { _id: id },
//             { $set: { "Status": status } }
//         );

//         if (status === "Approved") {
//             // Find the leave details
//             const leave = await ModelLeave.findOne({ _id: id });

//             if (!leave) {
//                 return res.status(404).send("Leave not found");
//             }

//             const currentYear = new Date().getFullYear();

//             // Calculate Leave Days
//             const startDate = new Date(leave.StartDate);
//             const endDate = new Date(leave.EndDate);

//             let leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
//             if (leaveDays === 0) leaveDays = 1; // If same day, count as 1

//             // Fetch Employee's Payroll
//             const payroll = await ModelPayroll.findOne({ empId: leave.empId });

//             if (!payroll) {
//                 return res.status(404).send("Payroll data not found");
//             }

//             let { monthlyLeave, yearlyLeave } = payroll;

//             // Deduct leave only if it exceeds monthly allowance
//             let extraLeaves = 0;
//             if (leaveDays > monthlyLeave) {
//                 extraLeaves = leaveDays - monthlyLeave;
//             }

//             // Deduct from yearly leave balance
//             let updatedYearlyLeave = yearlyLeave - extraLeaves;
//             if (updatedYearlyLeave < 0) updatedYearlyLeave = 0; // Prevent negative balance

//             // Update Payroll with the new yearly leave balance
//             await ModelPayroll.updateOne(
//                 { empId: leave.empId },
//                 { $set: { yearlyLeave: updatedYearlyLeave } }
//             );

//             // Fetch updated leaves of the employee for the current year
//             const leaves = await ModelLeave.find({
//                 empId: leave.empId,
//                 StartDate: {
//                     $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
//                     $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
//                 }
//             });

//             res.send({
//                 message: "Leave Approved Successfully"
//             });
//         } else {
//             res.send({
//                 message: "Leave Rejected"
//             });

//         }


//     } catch (err) {
//         console.error("Error updating:", err);
//         res.status(500).send("Error updating: " + err);
//     }
// });


// router.get("/monthly/:empId", async (req, res) => {
//     try {
//         const empId = req.params.empId; // ✅ Corrected parameter name
//         const currentDate = new Date();
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

//         const leaveCount = await Leave.countDocuments({
//             empId,
//             startDate: { $gte: startOfMonth, $lt: endOfMonth } // ✅ Correct date range
//         });

//         res.json({ totalAttendance: leaveCount }); // ✅ Match frontend response
//     } catch (error) {
//         console.error("Error fetching monthly leave count:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });





// // ➤ Delete Leave API (DELETE)
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const leaveRecord = await ModelLeave.findById(req.params.id);

//         if (!leaveRecord) {
//             return res.status(404).json({ message: "Leave record not found" });
//         }

//         await ModelLeave.deleteOne({ _id: req.params.id });
//         res.json({ message: "Deleted Successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "Error deleting leave record", error: err.message });
//     }
// });

// module.exports = router;

const express = require("express");
// const mongoose = require("mongoose");
const ModelLeave = require("../model/ModelLeave");
const ModelPayroll = require("../model/ModalPayroll");
const Emp = require("../model/ModalEmployee");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const employee = await Emp.findById(req.body.empId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const newLeave = new ModelLeave({
            empId: employee._id, // Use existing employee ID
            LeaveType: req.body.LeaveType,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            Noofday: req.body.Noofday,
            Days: req.body.Days,
            Reason: req.body.Reason,
            Status: req.body.Status,
            profile: String,
        });

        await newLeave.save();
        res.status(201).json({ message: "Leave added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error saving leave data", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const leaves = await ModelLeave.find().populate("empId", "firstname lastname profile");

        const leavesWithEmployee = leaves.map((leave) => ({
            ...leave.toObject(),
            employee: leave.empId
                ? {
                    firstname: leave.empId.firstname || "",
                    lastname: leave.empId.lastname || "",
                    profile: leave.empId.profile || ""  // ✅ Profile ઉમેર્યું
                }
                : { firstname: "Unknown", lastname: "", profile: "" }
        }));

        res.json(leavesWithEmployee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ➤ Get Employee By Id API (GET)
// router.get('/:id', async (req, res) => {
//     try {
//         const data = await ModelLeave.find({ _id: req.params.id });
//         res.send(data[0]);
//     } catch (err) {
//         res.status(500).send("Error: " + err);
//     }
// });

// router.get('/user/:id', async (req, res) => {
//     try {
//         const data = await ModelLeave.find({ empId: req.params.id });
//         res.send(data);
//     } catch (err) {
//         res.status(500).send("Error: " + err);
//     }
// });


router.get("/approved-leave-count", async (req, res) => {
    try {
        const approvedLeaves = await ModelLeave.find({ Status: "Approved" });

        let leaveCount = {};

        approvedLeaves.forEach(leave => {
            const days = leave.Noofday || 0; // Ensure it accounts for leave duration
            leaveCount[leave.empId] = (leaveCount[leave.empId] || 0) + days;
        });

        res.json(leaveCount);
    } catch (error) {
        console.error("Error fetching approved leave count:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// router.get("/employee/:id", async (req, res) => {
//     try {
//         const leaves = await ModelLeave.find({ empId: req.params.id });
//         res.json(leaves);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
router.get("/employee/:id", async (req, res) => {
    console.log("🔍 Request received for Employee ID:", req.params.id);

    try {
        const employee = await Emp.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "❌ Employee not found" });
        }
        console.log("✅ Employee Found:", employee);
        res.json(employee);
    } catch (err) {
        console.error("❌ Error fetching employee:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});



router.get("/lc/:employeeId", async (req, res) => {
    try {

        const { month, year } = req.query;



        // Convert month and year to Date range
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Last day of the month

        // Fetch leaves within the specified month and year
        const leaves = await ModelLeave.find({
            empId: new mongoose.Types.ObjectId(req.params['employeeId']),
            StartDate: { $gte: startDate, $lte: endDate },
        });

        // Calculate total leave days
        const totalLeaveDays = leaves.reduce((sum, leave) => sum + (leave.Noofday || 0), 0);

        res.json(leaves.length);
    } catch (error) {
        console.error("Error fetching leave count:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

router.get("/leave", async (req, res) => {
    try {
        const { employeeId, month, year } = req.query;

        // Find leaves for the given employee and month
        const leaves = await ModelLeave.find({ employeeId, month, year });

        // Calculate total leaves taken
        const totalLeavesTaken = leaves.reduce((sum, leave) => sum + leave.days, 0);

        // Fetch Employee salary
        //   const employee = await Employee.findById(employeeId);
        //   const salary = employee ? employee.salary : 0;

        // Apply Leave Deduction Logic
        let extraLeaveDeduction = 0;
        const allowedLeaves = 2; // Now allowing only 2 leaves
        if (totalLeavesTaken > allowedLeaves) {
            const extraLeaves = totalLeavesTaken - allowedLeaves;
            const perDaySalary = salary / 30;
            extraLeaveDeduction = extraLeaves * perDaySalary;
        }

        res.json({ totalLeaves: totalLeavesTaken, extraLeaveDeduction });
    } catch (error) {
        console.error("Error fetching leave data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ SPECIFIC ROUTES FIRST
router.get("/today-leave", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayLeaveCount = await ModelLeave.countDocuments({
            StartDate: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
        });

        res.json({ count: todayLeaveCount });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// ✅ Pending Leave Request Count API
router.get("/pending-leave-count", async (req, res) => {
    try {
        const totalLeaveRequests = await ModelLeave.countDocuments({
            $or: [{ Status: "Pending" }, { Status: "" }]
        });

        res.json({ count: totalLeaveRequests });
    } catch (error) {
        console.error("Error fetching pending leave count:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ GET ALL LEAVES
router.get("/", async (req, res) => {
    try {
        const leaves = await ModelLeave.find();
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get Leaves by Employee ID
router.get('/user/:id', async (req, res) => {
    try {
        const data = await ModelLeave.find({ empId: req.params.id });
        res.send(data);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});

// ✅ Get Leave by ID (Keep this LAST)
router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: "Invalid Leave ID" });
        }

        const leave = await ModelLeave.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: "Leave record not found" });

        res.json(leave);
    } catch (err) {
        res.status(500).json({ message: "Error fetching leave", error: err.message });
    }
});



// ➤ Update Leave API (PUT)
router.put('/update/:id', (req, res) => {
    ModelLeave.updateOne(
        { _id: req.params['id'] },
        { $set: req.body }
    )
        .then((result) => {
            res.send("Updated Successfully");
        })
        .catch((err) => res.status(500).send("Error updating: " + err));
});


router.put('/status/:id/:status', async (req, res) => {
    try {
        const { id, status } = req.params;

        // Update the leave status
        await ModelLeave.updateOne(
            { _id: id },
            { $set: { "Status": status } }
        );

        if (status === "Approved") {
            // Find the leave details
            const leave = await ModelLeave.findOne({ _id: id });

            if (!leave) {
                return res.status(404).send("Leave not found");
            }

            const currentYear = new Date().getFullYear();

            // Calculate Leave Days
            const startDate = new Date(leave.StartDate);
            const endDate = new Date(leave.EndDate);

            let leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            if (leaveDays === 0) leaveDays = 1; // If same day, count as 1

            // Fetch Employee's Payroll
            const payroll = await ModelPayroll.findOne({ empId: leave.empId });

            if (!payroll) {
                return res.status(404).send("Payroll data not found");
            }

            let { monthlyLeave, yearlyLeave } = payroll;

            // Deduct leave only if it exceeds monthly allowance
            let extraLeaves = 0;
            if (leaveDays > monthlyLeave) {
                extraLeaves = leaveDays - monthlyLeave;
            }

            // Deduct from yearly leave balance
            let updatedYearlyLeave = yearlyLeave - extraLeaves;
            if (updatedYearlyLeave < 0) updatedYearlyLeave = 0; // Prevent negative balance

            // Update Payroll with the new yearly leave balance
            await ModelPayroll.updateOne(
                { empId: leave.empId },
                { $set: { yearlyLeave: updatedYearlyLeave } }
            );

            // Fetch updated leaves of the employee for the current year
            const leaves = await ModelLeave.find({
                empId: leave.empId,
                StartDate: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                }
            });

            res.send({
                message: "Leave Approved Successfully"
            });
        } else {
            res.send({
                message: "Leave Rejected"
            });

        }


    } catch (err) {
        console.error("Error updating:", err);
        res.status(500).send("Error updating: " + err);
    }
});


// router.get("/monthly/:empId", async (req, res) => {
//     try {
//         let { empId } = req.params;

//         console.log("🔹 Received empId:", empId); // ✅ Log the received empId

//         // Check if empId is a valid MongoDB ObjectId
//         if (!mongoose.Types.ObjectId.isValid(empId)) {
//             console.log("❌ Invalid Employee ID format:", empId); // ✅ Log invalid cases
//             return res.status(400).json({ message: "Invalid Employee ID" });
//         }

//         empId = new mongoose.Types.ObjectId(empId); // Convert to ObjectId

//         const currentDate = new Date();
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

//         const leaveCount = await ModelLeave.countDocuments({
//             empId,
//             startDate: { $gte: startOfMonth, $lt: endOfMonth }
//         });

//         res.json({ totalAttendance: leaveCount });
//     } catch (error) {
//         console.error("❌ Error fetching monthly leave count:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// // ✅ SPECIFIC ROUTES FIRST
// router.get("/today-leave", async (req, res) => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         const todayLeaveCount = await ModelLeave.countDocuments({
//             StartDate: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
//         });

//         res.json({ count: todayLeaveCount });
//     } catch (error) {
//         res.status(500).json({ error: "Server error", details: error.message });
//     }
// });
// // Pending Leave Request Count API
// router.get("/pending-leave-count", async (req, res) => {
//     try {
//         const totalLeaveRequests = await ModelLeave.countDocuments({
//             $or: [{ Status: "Pending" }, { Status: "" }]
//         });

//         res.json({ count: totalLeaveRequests }); // Response ma count return karo
//     } catch (error) {
//         console.error("Error fetching pending leave count:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


// // ✅ GET ALL LEAVES (before dynamic `/:id`)
// router.get("/", async (req, res) => {
//     try {
//         const leaves = await ModelLeave.find();
//         res.json(leaves);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ✅ FIX: GET LEAVE BY ID (Validate ID before querying)
// router.get('/:id', async (req, res) => {
//     try {
//         // ✅ Validate if ID is a correct MongoDB ObjectId
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ error: "Invalid Leave ID" });
//         }

//         const leave = await ModelLeave.findById(req.params.id);
//         if (!leave) return res.status(404).json({ message: "Leave record not found" });

//         res.json(leave);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching leave", error: err.message });
//     }
// });

router.get("/monthly/:empId", async (req, res) => {
    try {
        const empId = req.params.empId;
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        // Fetch approved leaves within the month
        const leaves = await ModelLeave.find({
            empId: new mongoose.Types.ObjectId(empId),
            StartDate: { $gte: startOfMonth, $lte: endOfMonth },
            Status: "Approved"
        });

        // Calculate total leave days
        const totalLeaveDays = leaves.reduce((sum, leave) => sum + (leave.Noofday || 0), 0);

        res.json({ totalLeave: totalLeaveDays });
    } catch (error) {
        console.error("Error fetching monthly leave count:", error);
        res.status(500).json({ message: "Server error" });
    }
});



// ➤ Delete Leave API (DELETE)
router.delete('/delete/:id', async (req, res) => {
    try {
        const leaveRecord = await ModelLeave.findById(req.params.id);

        if (!leaveRecord) {
            return res.status(404).json({ message: "Leave record not found" });
        }

        await ModelLeave.deleteOne({ _id: req.params.id });
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting leave record", error: err.message });
    }
});

module.exports = router;


// const express = require("express");
// const mongoose = require("mongoose");
// const ModelLeave = require("../model/ModelLeave");
// const ModalPayroll = require("../model/ModalPayroll");
// const Emp = require("../model/ModalEmployee");

// const router = express.Router();

// // ➤ Add Leave
// router.post("/add", async (req, res) => {
//     try {
//         const employee = await Emp.findById(req.body.empId);
//         if (!employee) {
//             return res.status(404).json({ message: "Employee not found" });
//         }

//         const newLeave = new ModelLeave({
//             empId: employee._id,
//             LeaveType: req.body.LeaveType,
//             StartDate: req.body.StartDate,
//             EndDate: req.body.EndDate,
//             Noofday: req.body.Noofday,
//             Days: req.body.Days,
//             Reason: req.body.Reason,
//             Status: req.body.Status || "Pending",
//             profile: req.body.profile || "",
//         });

//         await newLeave.save();
//         res.status(201).json({ message: "Leave added successfully!" });
//     } catch (error) {
//         res.status(500).json({ message: "Error saving leave data", error: error.message });
//     }
// });

// // ➤ Get All Leaves with Employee Info
// router.get("/all", async (req, res) => {
//     try {
//         const leaves = await ModelLeave.find().populate("empId", "firstname lastname profile");
//         const result = leaves.map(leave => ({
//             ...leave.toObject(),
//             employee: leave.empId ? {
//                 firstname: leave.empId.firstname,
//                 lastname: leave.empId.lastname,
//                 profile: leave.empId.profile
//             } : { firstname: "Unknown", lastname: "", profile: "" }
//         }));
//         res.json(result);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // ➤ Approved Leave Count
// router.get("/approved-leave-count", async (req, res) => {
//     try {
//         const approvedLeaves = await ModelLeave.find({ Status: "Approved" });
//         let leaveCount = {};
//         approvedLeaves.forEach(leave => {
//             const days = leave.Noofday || 0;
//             leaveCount[leave.empId] = (leaveCount[leave.empId] || 0) + days;
//         });
//         res.json(leaveCount);
//     } catch (error) {
//         res.status(500).json({ message: "Server Error" });
//     }
// });

// // ➤ Get Employee By ID
// router.get("/employee/:id", async (req, res) => {
//     try {
//         const employee = await Emp.findById(req.params.id);
//         if (!employee) return res.status(404).json({ message: "Employee not found" });
//         res.json(employee);
//     } catch (err) {
//         res.status(500).json({ error: "Server Error", details: err.message });
//     }
// });

// // ➤ Get Monthly Leave Count for Employee
// router.get("/lc/:employeeId", async (req, res) => {
//     try {
//         const { month, year } = req.query;
//         const startDate = new Date(year, month - 1, 1);
//         const endDate = new Date(year, month, 0, 23, 59, 59, 999);

//         const leaves = await ModelLeave.find({
//             empId: new mongoose.Types.ObjectId(req.params.employeeId),
//             StartDate: { $gte: startDate, $lte: endDate },
//             Status: "Approved"
//         });

//         const totalLeaveDays = leaves.reduce((sum, leave) => sum + (leave.Noofday || 0), 0);
//         res.json({ count: totalLeaveDays });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// });

// // ➤ Get Today's Leave Count
// router.get("/today-leave", async (req, res) => {
//     try {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(today.getDate() + 1);

//         const count = await ModelLeave.countDocuments({
//             StartDate: { $gte: today, $lt: tomorrow },
//             Status: "Approved"
//         });

//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // ➤ Get Pending Leave Count
// router.get("/pending-leave-count", async (req, res) => {
//     try {
//         const count = await ModelLeave.countDocuments({
//             $or: [{ Status: "Pending" }, { Status: "" }]
//         });
//         res.json({ count });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // ➤ Get Leaves by Employee
// router.get("/user/:id", async (req, res) => {
//     try {
//         const leaves = await ModelLeave.find({ empId: req.params.id });
//         res.json(leaves);
//     } catch (err) {
//         res.status(500).send("Error: " + err);
//     }
// });

// // ➤ Get Leave by Leave ID
// router.get("/:id", async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             return res.status(400).json({ error: "Invalid Leave ID" });
//         }

//         const leave = await ModelLeave.findById(req.params.id);
//         if (!leave) return res.status(404).json({ message: "Leave not found" });

//         res.json(leave);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching leave", error: err.message });
//     }
// });

// // ➤ Update Leave
// router.put("/update/:id", async (req, res) => {
//     try {
//         await ModelLeave.updateOne({ _id: req.params.id }, { $set: req.body });
//         res.send("Updated Successfully");
//     } catch (err) {
//         res.status(500).send("Error updating: " + err);
//     }
// });

// // ➤ Update Status + Payroll Handling
// router.put("/status/:id/:status", async (req, res) => {
//     try {
//         const { id, status } = req.params;
//         const leave = await ModelLeave.findById(id);

//         if (!leave) return res.status(404).send("Leave not found");

//         await ModelLeave.updateOne({ _id: id }, { $set: { Status: status } });

//         if (status === "Approved") {
//             const startDate = new Date(leave.StartDate);
//             const endDate = new Date(leave.EndDate);
//             let leaveDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

//             const payroll = await ModelPayroll.findOne({ empId: leave.empId });
//             if (!payroll) return res.status(404).send("Payroll data not found");

//             const extraLeaves = Math.max(0, leaveDays - payroll.monthlyLeave);
//             const updatedYearlyLeave = Math.max(0, payroll.yearlyLeave - extraLeaves);

//             await ModelPayroll.updateOne(
//                 { empId: leave.empId },
//                 { $set: { yearlyLeave: updatedYearlyLeave } }
//             );
//         }

//         res.send({ message: `Leave ${status}` });
//     } catch (err) {
//         res.status(500).send("Error updating: " + err);
//     }
// });

// // ➤ Monthly Leave Count for Current Month
// router.get("/monthly/:empId", async (req, res) => {
//     try {
//         const empId = req.params.empId;
//         const currentDate = new Date();
//         const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//         const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

//         const leaves = await ModelLeave.find({
//             empId: new mongoose.Types.ObjectId(empId),
//             StartDate: { $gte: startOfMonth, $lte: endOfMonth },
//             Status: "Approved"
//         });

//         const totalLeaveDays = leaves.reduce((sum, leave) => sum + (leave.Noofday || 0), 0);
//         res.json({ totalLeave: totalLeaveDays });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// // ➤ Delete Leave
// router.delete("/delete/:id", async (req, res) => {
//     try {
//         const leave = await ModelLeave.findById(req.params.id);
//         if (!leave) return res.status(404).json({ message: "Leave not found" });

//         await ModelLeave.deleteOne({ _id: req.params.id });
//         res.json({ message: "Deleted Successfully" });
//     } catch (err) {
//         res.status(500).json({ message: "Error deleting leave record", error: err.message });
//     }
// });

// module.exports = router;
