const express = require("express");
const mongoose = require("mongoose");  // ✅ Import mongoose
const Attendance = require("../model/ModalAttendance"); // ✅ Correct Import
const Employee = require("../model/ModalEmployee");
const ModelShift = require("../model/ModelShift");
const router = express.Router();

// ➤ Add Attendance API (POST)
router.post("/add", async (req, res) => {
    try {
        // Validate empId format
        if (!req.body.empId || req.body.empId.length !== 24) {
            return res.status(400).json({ error: "Invalid empId. Must be a 24-character MongoDB ObjectId." });
        }

        // Fetch Employee and Shift Details
        const user = await Employee.findById(req.body.empId);
        if (!user) return res.status(404).json({ error: "Employee not found" });

        const shiftDetails = await ModelShift.findById(user.shift);
        if (!shiftDetails) return res.status(404).json({ error: "Shift details not found" });

        // Get current server time
        const now = new Date();
        const currentDate = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
        const checkInTime = now.toTimeString().split(" ")[0]; // Format: HH:mm:ss

        // Convert times to Date objects for comparison
        const shiftStart = new Date(`${currentDate}T${shiftDetails.start_time}`);
        const userCheckIn = new Date(`${currentDate}T${checkInTime}`);

        // Determine Status (Late or Regular)
        let status = "Regular";
        if (userCheckIn > shiftStart) {
            status = "Late"; // Check-in is after shift start time
        }

        // Save Attendance Data
        const attendance = new Attendance({
            empId: new mongoose.Types.ObjectId(req.body.empId),
            checkin: checkInTime, // Server time used
            checkout: "",
            date: currentDate,
            status: status,
        });

        await attendance.save();
        res.json({ message: "Inserted Successfully", status, checkInTime });

    } catch (error) {
        console.error("Error inserting attendance:", error);
        res.status(500).json({ error: error.message });
    }
});
    

router.post("/checkout", async (req, res) => {
    try {
        if (!req.body.empId || req.body.empId.length !== 24) {
            return res.status(400).json({ error: "Invalid empId. Must be a 24-character MongoDB ObjectId." });
        }

        const user = await Employee.findById(req.body.empId);
        if (!user) return res.status(404).json({ error: "Employee not found" });

        const shiftDetails = await ModelShift.findById(user.shift);
        if (!shiftDetails) return res.status(404).json({ error: "Shift details not found" });

        const now = new Date();
        const currentDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const checkoutTime = now.toTimeString().split(" ")[0]; // HH:mm:ss

        const attendance = await Attendance.findOne({
            empId: req.body.empId,
            date: currentDate,
        });

        if (!attendance) {
            return res.status(400).json({ error: "No check-in record found for today." });
        }

        // Convert check-in and check-out times to Date objects
        const checkinTime = new Date(`${currentDate}T${attendance.checkin}`);
        let checkoutTimeObj = new Date(`${currentDate}T${checkoutTime}`);

        // Handle night shift (if checkout happens after midnight)
        if (checkoutTimeObj < checkinTime) {
            checkoutTimeObj.setDate(checkoutTimeObj.getDate() + 1); // Move to next day
        }

        // Calculate total worked hours
        let totalHours = (checkoutTimeObj - checkinTime) / (1000 * 60 * 60); // Convert ms to hours
        totalHours = parseFloat(totalHours.toFixed(2)); // Round to 2 decimals

        // Determine checkout status (Early Leave or On Time)
        const shiftEnd = new Date(`${currentDate}T${shiftDetails.end_time}`);
        if (checkoutTimeObj < shiftEnd) {
            attendance.checkoutStatus = "Early Leave";
        } else {
            attendance.checkoutStatus = "On Time";
        }

        // Update attendance record
        attendance.checkout = checkoutTime;
        attendance.totalHours = totalHours;
        await attendance.save();

        res.json({
            message: "Checkout Updated Successfully",
            status: attendance.checkoutStatus,
            checkoutTime,
            totalHours,
        });

    } catch (error) {
        console.error("Error updating checkout:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/status/:id", async (req, res) => {
    try {
        const empId = req.params.id; // Read from URL params

        if (!empId || empId.length !== 24) {
            return res.status(400).json({ error: "Invalid empId. Must be a 24-character MongoDB ObjectId." });
        }

        const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD


        const attendance = await Attendance.findOne({
            empId: empId,
            date: currentDate,
        });

        if (!attendance) {
            return res.json({
                message: "User has not checked in today.",
                checkedIn: false,
                checkedOut: false,
            });
        }

        const response = {
            message: "Attendance record found.",
            checkedIn: !!attendance.checkin,
            checkedOut: !!attendance.checkout,
            checkinTime: attendance.checkin || null,
            checkoutTime: attendance.checkout || null,
        };

        res.json(response);

    } catch (error) {
        console.error("Error fetching attendance status:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get("/last-30/", async (req, res) => {
    try {
        try {
            const attendanceRecords = await Attendance.find().populate("empId", "firstname lastname profile designation mobileNo").sort({ date: -1 }).limit(30);
            res.json(attendanceRecords);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } catch (error) {
        console.error("Error fetching last 30 attendance records:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/last-30/:empId", async (req, res) => {
    try {
        const { empId } = req.params;

        // Fetch last 30 attendance records sorted by check-in date (latest first)
        const attendanceRecords = await Attendance.find({ empId: empId })
            .sort({ date: -1 }) // Sorting in descending order (latest first)
            .limit(30); // Fetch only the last 30 records

        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching last 30 attendance records:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/emp/:empId", async (req, res) => {
    try {
        const { empId } = req.params;

        const attendanceRecords = await Attendance.find({ empId: empId })
            .sort({ date: -1 }) // Sorting in descending order (latest first)


        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching last 30 attendance records:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find()
            .populate("empId", "firstname lastname profile designation mobileNo employeeType") // ✅ Include employeeType
            .sort({ date: -1 })
            .limit(30);

        res.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/today", async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
        const attendanceRecords = await Attendance.find({ date: today }); // Fetch today's attendance data
        res.json({ total: attendanceRecords.length, records: attendanceRecords });
    } catch (error) {
        res.status(500).json({ error: "Error fetching attendance data" });
    }
});





  

router.get("/attendance/total-hours/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching attendance for ID: ${id}`);
  
      if (!id || id.length !== 24) {  // MongoDB ObjectId Length 24 Hov Joye
        return res.status(400).json({ message: "Invalid Employee ID" });
      }
  
      const attendance = await AttendanceModel.findOne({ employeeId: id });
  
      if (!attendance) {
        return res.status(404).json({ message: "Attendance record not found" });
      }
  
      res.json({ totalHours: attendance.totalHours });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
});


// ➤ Get Attendance By ID API (GET)
router.get('/:id', async (req, res) => {
    try {
        const data = await Attendance.findById(req.params.id)
            .populate("empId", "firstname lastname profile"); // ✅ Include profile

        if (!data) {
            return res.status(404).send("Attendance record not found");
        }

        res.json(data);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});

router.get('/emp/:id', async (req, res) => {
    try {
        const data = await Attendance.find({ empId: req.params.id })
            .populate("empId", "firstname lastname profile"); // ✅ Include profile

        if (!data) {
            return res.status(404).send("Attendance record not found");
        }

        res.json(data);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});



// ➤ Update Attendance API (PUT)
router.put('/update/:id', async (req, res) => {
    try {
        const updated = await Attendance.findByIdAndUpdate(req.params.id, { $set: req.body });
        if (!updated) {
            return res.status(404).send("Attendance record not found");
        }
        res.send("Updated Successfully");
    } catch (err) {
        res.status(500).send("Error updating: " + err);
    }
});

// ➤ Delete Attendance API (DELETE)
router.delete('/delete/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findById(req.params.id);
        if (!attendance) {
            return res.status(404).send("Attendance record not found");
        }

        await Attendance.deleteOne({ _id: req.params.id });
        res.send("Deleted Successfully");
    } catch (err) {
        res.status(500).send("Error deleting: " + err.message);
    }
});

module.exports = router;
