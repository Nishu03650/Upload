const express = require("express");
const mongoose = require("mongoose");
const RouteLeave = require("./routes/RouteLeave");
const RouteDepartment = require("./routes/RouteDepartment");
const RouteEmployee = require("./routes/RouteEmployee");
const RouteAttendance = require("./routes/RouteAttendance");
const RoutePayroll = require("./routes/RoutePayroll");
const RouteHoliday = require("./routes/RouteHoliday");
const RouteAuthentication = require("./routes/RouteAuthentication");
const RouteShift = require("./routes/RouteShift");
const RoutePayslip = require("./routes/RoutePayslip");

const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ limit: "5000mb", extended: true }));

// ➤ **Single MongoDB Connection**
const MONGO_URI = "mongodb://127.0.0.1:27017/SmartHr"; // Fixed connection URL
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ➤ **Use Routes**
app.use("/leave", RouteLeave);
app.use("/dept", RouteDepartment);
app.use("/emp", RouteEmployee);
app.use("/attendance", RouteAttendance);
app.use("/payroll", RoutePayroll);
app.use("/holiday", RouteHoliday);
app.use("/authentication", RouteAuthentication);
app.use("/shift", RouteShift);
app.use("/payslip", RoutePayslip);

// ➤ **Start Server**
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
