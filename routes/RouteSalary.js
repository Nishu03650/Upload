const express = require('express');
const router = express.Router();
const Salary = require('../model/ModalSalary');
const Emp = require("../model/ModalEmployee"); // ✅ Correct Import

// 🔹 Salary Generate API (Total Hours Mate)
router.post('/salary', async (req, res) => {
    try {
        const { employeeId, month, totalHours, hourlyRate } = req.body;

        // Check total hours 0 hoy to employee ni attendance jova
        let finalHours = totalHours;
        if (totalHours === 0) {
            // Assume ke Employee model ma "attendance" field che jema hours store thay che
            const employee = await Employee.findById(employeeId);
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }
            finalHours = employee.attendance || 0; // Jo employee.attendance undefined hoy to 0 lidhu
        }

        const totalSalary = finalHours * hourlyRate;

        const salary = new Salary({
            employeeId,
            month,
            totalHours: finalHours, // Attendance mathi male to update
            hourlyRate,
            totalSalary,
        });

        await salary.save();
        res.status(201).json({ message: "Salary generated successfully", salary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Get Salary Details (Employee Wise)
router.get('/salary/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const salaryRecords = await Salary.find({ employeeId });

        res.status(200).json(salaryRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/salary", async (req, res) => {
  try {
      const salaries = await SalaryModel.find();
      res.json(salaries);
  } catch (error) {
      console.error("Salary API Error:", error); // 👈 Backend ma error log karo
      res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/total-hours/:employeeId", async (req, res) => {
    try {
      const { employeeId } = req.params;
  
      // ➤ Employee na total hours sum kariye
      const totalHours = await Attendance.aggregate([
        { $match: { employeeId: employeeId } },
        { $group: { _id: "$employeeId", totalHours: { $sum: "$totalHours" } } },
      ]);
  
      if (totalHours.length === 0) {
        return res.status(404).json({ message: "No attendance found for this employee." });
      }
  
      res.json({ employeeId, totalHours: totalHours[0].totalHours });
    } catch (error) {
      console.error("Error fetching total hours:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

module.exports = router;
