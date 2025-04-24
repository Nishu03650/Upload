const express = require("express");
const ModelDepartment = require("../model/ModalDepartement"); // ✅ Correct Import
const Employee = require("../model/ModalEmployee"); // ✅ Correct Import
const router = express.Router();

router.post("/adddept", (req, res) => {
    console.log("Incoming Request:", req.body);

    const department = new ModelDepartment({
        "name":  req.body.department
    });

    department.save()
        .then(() => res.send("Inserted Successfully"))
        .catch((error) => {
            console.error("Error inserting Department:", error);
            res.status(500).send("NOT Inserted - " + error.message);
        });
});


// ➤ Get All Employees API (GET)
router.get('/', async (req, res) => {
    // console.log("jgjjgj");
    // res.send("hii");
    try {
        const departments = await ModelDepartment.find(); // Department Data Fetch કરો

        const departmentList = await Promise.all(
            departments.map(async (dept) => {
                const employees = await Employee.find({ "department": dept._id }); // Employees શોધો

                return {
                    ...dept.toObject(), // Department data object માં ફેરવો
                    membersCount: employees.length, // Employee Count ઉમેરો
                    members: employees
                };
            })
        );

        res.json(departmentList);
    } catch (err) {
        res.status(500).send("Error: " + err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const departmentId = req.params.id;

        // Convert to ObjectId
        if (!mongoose.Types.ObjectId.isValid(departmentId)) {
            return res.status(400).json({ message: "Invalid Department ID" });
        }

        // Find department by ID
        const department = await ModelDepartment.findById(departmentId);

        if (!department) {
            return res.status(404).json({ message: "Department not found" });
        }

        // Return formatted department data
        res.json({
            name: department.name,
            membersCount: department.members.length,
            members: department.members
        });

    } catch (err) {
        console.error("Error fetching department data:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// ✅ Delete Department API
router.delete("/deletedept/:id", async (req, res) => {
    try {
        await ModelDepartment.findByIdAndDelete(req.params.id);
        res.send("Deleted Successfully");
    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).send("Error: " + error.message);
    }
});

// ➤ Update Employee API (PUT)
router.put('/updatedept/:id', (req, res) => {
    ModelDepartment.updateOne(
        { _id: req.params['id'] },
        { $set: req.body }
    )
        .then((result) => {
            res.send("Updated Successfully");
        })
        .catch((err) => res.status(500).send("Error updating: " + err));
});

module.exports = router;
