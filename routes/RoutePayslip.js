// const express = require("express");
// const Payslip = require("../model/ModalPayslip"); // ✅ Payslip Model (Create this if missing)
// const Emp = require("../model/ModalEmployee"); // ✅ Employee Model
// const router = express.Router();

// // ➤ ✅ Generate Payslip with Employee Details
// router.get("/:id", async (req, res) => {
//     try {
//         // Fetch Employee details
//         const employee = await Emp.findById(req.params.id);
//         if (!employee) return res.status(404).send("Employee not found");

//         // Fetch Payslip details
//         const payslip = await Payslip.findOne({ employeeId: req.params.id });
//         if (!payslip) return res.status(404).send("Payslip not found");

//         // Send Payslip with Employee Info
//         res.send({
//             firstname: employee.firstname,
//             lastname: employee.lastname,
//             email: employee.email,
//             mobileNo: employee.mobileNo,
//             designation: employee.designation,
//             salary: payslip.salary || 0,
//             deductions: payslip.deductions || 0,
//             netPay: payslip.netPay || 0,
//             month: payslip.month,
//             year: payslip.year,
//         });
//     } catch (err) {
//         console.error("Error generating payslip:", err);
//         res.status(500).send("Error: " + err.message);
//     }
// });

// module.exports = router;

const express = require("express");
const Payslip = require("../model/ModalPayslip"); // Tamaro Payslip model
const mongoose = require("mongoose");

const router = express.Router();

// ➤ **Create Payslip API (POST)**
router.post("/add", async (req, res) => {
    try {
        console.log("Incoming Payslip Data:", req.body);
        
        const { employee } = req.body;
        if (employee) {
            req.body.employee = new mongoose.Types.ObjectId(employee);
        }

        const newPayslip = new Payslip(req.body);
        await newPayslip.save();

        const payslipData = await Payslip.findById(newPayslip._id).populate("employee", "firstname lastname email");
        res.status(201).json(payslipData);
    } catch (error) {
        console.error("Error inserting payslip:", error);
        res.status(500).json({ message: "NOT Inserted", error: error.message });
    }
});

// ➤ **Get All Payslips (GET)**
router.get("/", async (req, res) => {
    try {
        const payslips = await Payslip.find().populate("employee", "firstname lastname email");
        res.json(payslips);
    } catch (err) {
        console.error("Error fetching payslips:", err);
        res.status(500).json({ message: "Error fetching payslips", error: err.message });
    }
});

// ➤ **Get Payslip by ID (GET)**
router.get("/:id", async (req, res) => {
    try {
        const payslip = await Payslip.findById(req.params.id)
            .populate("employee", "firstname lastname email");

        if (!payslip) {
            return res.status(404).json({ message: "Payslip not found" });
        }

        res.json(payslip);
    } catch (err) {
        console.error("Error fetching payslip:", err);
        res.status(500).json({ message: "Error fetching payslip", error: err.message });
    }
});

// ➤ **Update Payslip (PUT)**
router.put("/update/:id", async (req, res) => {
    try {
        console.log("Update Payslip Data:", req.body);

        const updatedPayslip = await Payslip.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true }
        ).populate("employee", "firstname lastname email");

        if (!updatedPayslip) {
            return res.status(404).json({ message: "Payslip not found" });
        }

        res.json(updatedPayslip);
    } catch (err) {
        console.error("Error updating payslip:", err);
        res.status(500).json({ message: "Error updating", error: err.message });
    }
});

// ➤ **Delete Payslip (DELETE)**
router.delete("/delete/:id", async (req, res) => {
    try {
        const payslip = await Payslip.findById(req.params.id);
        if (!payslip) {
            return res.status(404).json({ message: "Payslip not found" });
        }

        await Payslip.deleteOne({ _id: req.params.id });
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        console.error("Error deleting payslip:", err);
        res.status(500).json({ message: "Error deleting", error: err.message });
    }
});

module.exports = router;
