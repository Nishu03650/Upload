// const express = require("express");
// const router = express.Router();
// const Shift = require("../model/ModelShift"); // Import Model

// // ✅ Get All Shifts
// router.get("/", async (req, res) => {
//   try {
//     const shifts = await Shift.find();
//     res.json(shifts);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching shifts" });
//   }
// });

// // ✅ Get Shift by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const shift = await Shift.findById(req.params.id);
//     if (!shift) return res.status(404).json({ error: "Shift not found" });
//     res.json(shift);
//   } catch (error) {
//     res.status(500).json({ error: "Error fetching shift" });
//   }
// });

// // ✅ Add Shift
// router.post("/addshift", async (req, res) => {
//   try {
//     const { name, start_time, end_time } = req.body;
//     const totalHours=start_time-end_time;
//     if (!name || !start_time || !end_time) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const newShift = new Shift({ name, start_time, end_time,totalHours });
//     await newShift.save();
//     res.status(201).json({ message: "Shift added successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // ✅ Update Shift
// router.put("/update/:id", async (req, res) => {
//   try {
//     const { name, start_time, end_time } = req.body;
//     const updatedShift = await Shift.findByIdAndUpdate(req.params.id, { name, start_time, end_time }, { new: true });
//     res.json({ message: "Shift updated successfully", updatedShift });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating shift" });
//   }
// });


// router.delete("/delete/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         console.log("Deleting Shift with ID:", id);
//         const deletedShift = await Shift.findByIdAndDelete(id);

//         if (!deletedShift) {
//             return res.status(404).send("Shift Not Found");
//         }
//         res.status(200).send("Shift Deleted Successfully");
//     } catch (error) {
//         console.error("Error deleting Shift:", error);
//         res.status(500).send("Failed to delete Shift");
//     }
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
const Shift = require("../model/ModelShift");

// 🟢 Get All Shifts
router.get("/", async (req, res) => {
  try {
    const shifts = await Shift.find();
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching shifts" });
  }
});

// 🟢 Get Shift by ID
router.get("/:id", async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    if (!shift) return res.status(404).json({ error: "Shift not found" });
    res.json(shift);
  } catch (error) {
    res.status(500).json({ error: "Error fetching shift" });
  }
});

// 🔵 Add Shift with Total Hours Calculation
router.post("/addshift", async (req, res) => {
  try {
    const { name, start_time, end_time } = req.body;

    if (!name || !start_time || !end_time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Convert Time Strings to Date Objects
    const startTime = new Date(`1970-01-01T${start_time}Z`);
    const endTime = new Date(`1970-01-01T${end_time}Z`);

    // Check if Date conversion is valid
    if (isNaN(startTime) || isNaN(endTime)) {
      return res.status(400).json({ error: "Invalid time format. Use HH:mm:ss" });
    }

    // Calculate Total Hours (Difference in Hours)
    let totalHours = (endTime - startTime) / (1000 * 60 * 60); // Convert ms to hours

    // Handle Midnight Shift Issue
    if (totalHours < 0) {
      totalHours += 24;
    }

    const newShift = new Shift({ 
      name, 
      start_time, 
      end_time, 
      totalHours: parseFloat(totalHours.toFixed(2)) // Convert string to number
    });

    await newShift.save();
    res.status(201).json({ message: "Shift added successfully", newShift });
  } catch (error) {
    console.error("Error Adding Shift:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 🟠 Update Shift with Recalculated Total Hours
router.put("/update/:id", async (req, res) => {
  try {
    const { name, start_time, end_time } = req.body;

    // Convert Time Strings to Date Objects
    const startTime = new Date(`1970-01-01T${start_time}:00Z`);
    const endTime = new Date(`1970-01-01T${end_time}:00Z`);

    // Calculate Total Hours
    let totalHours = (endTime - startTime) / (1000 * 60 * 60);
    if (totalHours < 0) totalHours += 24;

    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      { name, start_time, end_time, totalHours: totalHours.toFixed(2) },
      { new: true }
    );

    res.json({ message: "Shift updated successfully", updatedShift });
  } catch (error) {
    res.status(500).json({ error: "Error updating shift" });
  }
});

// 🔴 Delete Shift
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting Shift with ID:", id);
    const deletedShift = await Shift.findByIdAndDelete(id);

    if (!deletedShift) {
      return res.status(404).send("Shift Not Found");
    }
    res.status(200).send("Shift Deleted Successfully");
  } catch (error) {
    console.error("Error deleting Shift:", error);
    res.status(500).send("Failed to delete Shift");
  }
});

module.exports = router;
