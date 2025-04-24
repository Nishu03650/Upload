const express = require("express");
const ModelHoliday = require("../model/ModalHoliday"); // Fixed naming

const router = express.Router();

// ➤ Add Holiday API (POST)
router.post("/add", async (req, res) => {
    try {
        console.log("Incoming Request:", req.body); // Debug log

        const holiday = new ModelHoliday({
            Date: req.body.Date,
            Days: req.body.Days,
            Holidayname: req.body.Holidayname,
        });

        await holiday.save();
        res.status(201).json({ message: "Holiday added successfully", holiday });
    } catch (error) {
        console.error("Error inserting holiday:", error);
        res.status(500).json({ message: "Error inserting holiday", error });
    }
});

// ➤ Get All Holidays (GET)
router.get("/", async (req, res) => {
    try {
        const data = await ModelHoliday.find();
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching holidays:", err);
        res.status(500).send("Error: " + err);
    }
});

// ➤ Get Single Holiday (GET)
// router.get("/:id", async (req, res) => {
//     try {
//         const data = await ModelHoliday.findById(req.params.id);
//         if (!data) {
//             return res.status(404).json({ message: "Holiday not found" });
//         }
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: "Error fetching holiday", error: err });
//     }
// });

// ➤ ✅ Get Monthly Holiday Count API (MOVE THIS ROUTE UP)
router.get("/monthly-total", async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const currentYear = new Date().getFullYear();

        console.log(`Fetching holidays for month: ${currentMonth}, year: ${currentYear}`);

        // Get First & Last Day of the Month
        const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        // Count Holidays in Current Month
        const totalHolidays = await ModelHoliday.countDocuments({
            Date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        console.log(`Total holidays this month: ${totalHolidays}`);
        res.status(200).json({ totalHolidays });
    } catch (error) {
        console.error("Error fetching monthly holidays:", error);
        res.status(500).json({ message: "Error fetching holidays", error });
    }
});

// ➤ Get Single Holiday (GET)
router.get("/:id", async (req, res) => {
    try {
        const data = await ModelHoliday.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: "Holiday not found" });
        }
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching holiday", error: err });
    }
});



// ➤ Update Holiday API (PUT)
router.put("/update/:id", async (req, res) => {
    try {
        const updatedHoliday = await ModelHoliday.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedHoliday) {
            return res.status(404).json({ message: "Holiday not found" });
        }
        res.json({ message: "Updated Successfully", updatedHoliday });
    } catch (err) {
        res.status(500).json({ message: "Error updating holiday", error: err });
    }
});

// ➤ Delete Holiday API (DELETE)
router.delete("/delete/:id", async (req, res) => {
    try {
        const holiday = await ModelHoliday.findById(req.params.id);
        if (!holiday) {
            return res.status(404).json({ message: "Holiday not found" });
        }

        await ModelHoliday.deleteOne({ _id: req.params.id });
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting holiday", error: err });
    }
});

module.exports = router;