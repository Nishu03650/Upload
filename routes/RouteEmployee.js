// const express = require("express");
// const Emp = require("../model/ModalEmployee"); // ✅ Correct Import
// const Department = require("../model/ModalDepartement"); // ✅ Correct Import
// const router = express.Router();
// const mongoose = require("mongoose");

// // ➤ Add Employee API (POST)
// router.post("/add", (req, res) => {
//     console.log("Incoming Request:", req.body);
//     const { shift } = req.body;
//     if (shift) {
//         req.body.shift = new mongoose.Types.ObjectId(shift);
//     }
//     const addemp = new Emp(req.body);

//     addemp.save()
//         .then(() => res.send("Inserted Successfully"))
//         .catch((error) => {
//             console.error("Error inserting employee:", error);
//             res.status(500).send("NOT Inserted - " + error.message);
//         });
// });


// router.get("/", async (req, res) => {
//     try {
//         const employees = await Emp.find()
//             .populate("department", "name") // ✅ Fetch ID + name (ID comes by default)
           

//         res.send(employees);
//     } catch (err) {
//         console.error("Error fetching employees:", err);
//         res.status(500).send("Error: " + err);
//     }
// });




// // ➤ Get Employee By Id API (GET)
// router.get('/:id', async (req, res) => {
//     try {
//         const data = await Emp.find({ _id: req.params.id });
//         res.send(data[0]);
//     } catch (err) {
//         res.status(500).send("Error: " + err);
//     }
// });




// // ➤ Update Employee API (PUT)
// router.put('/update/:id', (req, res) => {

//     const { shift } = req.body;
//     if (shift) {
//         req.body.shift = new mongoose.Types.ObjectId(shift);
//     }

//     Emp.updateOne(
//         { _id: req.params['id'] },
//         { $set: req.body }
//     )
//         .then((result) => {
//             res.send("Updated Successfully");
//         })
//         .catch((err) => res.status(500).send("Error updating: " + err));
// });

// // ➤ Delete Employee API (DELETE) - UPDATED
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const addemp = await Emp.findById(req.params.id);
//         if (!addemp) {
//             return res.status(404).send("Employee not found");
//         }

//         await Emp.deleteOne({ _id: req.params.id });
//         res.send("Deleted Successfully");
//     } catch (err) {
//         res.status(500).send("Error deleting: " + err.message);
//     }
// });



// module.exports = router;

// const express = require("express");
// const Emp = require("../model/ModalEmployee"); // ✅ Correct Import
// const Department = require("../model/ModalDepartement"); // ✅ Correct Import
// const router = express.Router();
// const mongoose = require("mongoose");

// // ➤ Add Employee API (POST)
// router.post("/add", (req, res) => {
//     console.log("Incoming Request:", req.body);
//     const { shift } = req.body;
//     if (shift) {
//         req.body.shift = new mongoose.Types.ObjectId(shift);
//     }
//     const addemp = new Emp(req.body);

//     addemp.save()
//         .then(() => res.send("Inserted Successfully"))
//         .catch((error) => {
//             console.error("Error inserting employee:", error);
//             res.status(500).send("NOT Inserted - " + error.message);
//         });
// });

// // ➤ Get All Employees API (GET)
// router.get("/", async (req, res) => {
//     try {
//         const employees = await Emp.find()
//             .populate("department", "name"); // ✅ Fetch department ID + name

//         res.send(employees);
//     } catch (err) {
//         console.error("Error fetching employees:", err);
//         res.status(500).send("Error: " + err);
//     }
// });

// // ➤ Get Employee By ID API (GET) (Modified to Include Required Fields)
// // // ➤ Get Employee By Id API (GET)
// // ➤ Get Employee By Id API (GET)
// router.get('/:id', async (req, res) => {
//     try {
//         const employee = await Emp.findById(req.params.id)
//         .populate("department", "name") // 🔥 Department name fetch kare
//             .select("firstname lastname  designation email mobileNo gender maritalStatus employeeType birthdate joiningdate nationality zip address shift profile"); // ✅ Required fields only

//         if (!employee) {
//             return res.status(404).send("Employee not found");
//         }
        
//         res.send(employee);
//     } catch (err) {
//         console.error("Error fetching employee:", err);
//         res.status(500).send("Error: " + err);
//     }
// });

// // 
// router.get("/employee/:id", async (req, res) => {
//     try {
//       const employee = await Employee.findById(req.params.id);
//       if (!employee) {
//         return res.status(404).json({ message: "Employee not found" });
//       }
//       res.json(employee);
//     } catch (error) {
//       console.error("❌ Error fetching employee:", error);
//       res.status(500).json({ message: "Server error", error });
//     }
//   });
  
  

// // ➤ Update Employee API (PUT)
// router.put('/update/:id', (req, res) => {
//     const { shift } = req.body;
//     if (shift) {
//         req.body.shift = new mongoose.Types.ObjectId(shift);
//     }

//     Emp.updateOne(
//         { _id: req.params['id'] },
//         { $set: req.body }
//     )
//         .then(() => {
//             res.send("Updated Successfully");
//         })
//         .catch((err) => res.status(500).send("Error updating: " + err));
// });

// // ➤ Update Employee API (PUT)
// router.put('/update/:id', async (req, res) => {
//     try {
//         const { shift } = req.body;
//         if (shift) {
//             req.body.shift = new mongoose.Types.ObjectId(shift);
//         }

//         const updatedEmployee = await Emp.findByIdAndUpdate(
//             req.params.id,
//             { $set: req.body },
//             { new: true } // ✅ Returns updated document
//         ).populate("department", "name"); // ✅ Ensures department field is included

//         if (!updatedEmployee) {
//             return res.status(404).send("Employee not found");
//         }

//         res.send(updatedEmployee);
//     } catch (err) {
//         console.error("Error updating employee:", err);
//         res.status(500).send("Error updating: " + err.message);
//     }
// });


// // ➤ Delete Employee API (DELETE)
// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const addemp = await Emp.findById(req.params.id);
//         if (!addemp) {
//             return res.status(404).send("Employee not found");
//         }

//         await Emp.deleteOne({ _id: req.params.id });
//         res.send("Deleted Successfully");
//     } catch (err) {
//         res.status(500).send("Error deleting: " + err.message);
//     }
// });

// module.exports = router;


const express = require("express");
const Emp = require("../model/ModalEmployee"); // ✅ Correct Import
const Department = require("../model/ModalDepartement"); // ✅ Correct Import
const router = express.Router();
const mongoose = require("mongoose");

// ➤ Add Employee API (POST)
router.post("/add", async (req, res) => {
    try {
        console.log("Incoming Request:", req.body);
        const { shift, department } = req.body;

        if (shift) {
            req.body.shift = new mongoose.Types.ObjectId(shift);
        }
        if (department) {
            req.body.department = new mongoose.Types.ObjectId(department);
        }

        const addemp = new Emp(req.body);
        await addemp.save();

        const employee = await Emp.findById(addemp._id).populate("department", "name"); // ✅ Ensure department is included
        res.status(201).json(employee);
    } catch (error) {
        console.error("Error inserting employee:", error);
        res.status(500).json({ message: "NOT Inserted", error: error.message });
    }
});

// ➤ Get All Employees API (GET)
router.get("/", async (req, res) => {
    try {
        const employees = await Emp.find().populate("department", "name"); // ✅ Fetch department details
        res.json(employees);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ message: "Error fetching employees", error: err.message });
    }
});

//➤ Get Employee By ID API (GET)
router.get("/:id", async (req, res) => {
    try {
        const employee = await Emp.findById(req.params.id)
            .populate("department", "name") // ✅ Fetch department name
            .select("firstname lastname designation email mobileNo gender maritalStatus employeeType birthdate joiningdate nationality zip address shift profile department");

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        res.json(employee);
    } catch (err) {
        console.error("Error fetching employee:", err);
        res.status(500).json({ message: "Error fetching employee", error: err.message });
    }
});


// ➤ Update Employee API (PUT) - Now Fully Fixed
router.put("/update/:id", async (req, res) => {
    try {
        const { shift, department } = req.body;
        
        if (shift) req.body.shift = new mongoose.Types.ObjectId(shift);
        if (department) req.body.department = new mongoose.Types.ObjectId(department);

        console.log("Update Request Body:", req.body);

        const updatedEmployee = await Emp.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true } // ✅ Returns updated document
        ).populate("department", "name"); // ✅ Populate department name

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(updatedEmployee);
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ message: "Error updating", error: err.message });
    }
});

// ➤ Delete Employee API (DELETE)
router.delete("/delete/:id", async (req, res) => {
    try {
        const employee = await Emp.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        await Emp.deleteOne({ _id: req.params.id });
        res.json({ message: "Deleted Successfully" });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ message: "Error deleting", error: err.message });
    }
});

module.exports = router;
