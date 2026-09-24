const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"]
}));

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const renewalRoutes = require("./routes/renewalRoutes");
const documentRoutes = require("./routes/documentRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const historyRoutes = require("./routes/historyRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/renewals", renewalRoutes);
app.use("/api/documents", documentRoutes);
console.log("DOCUMENT ROUTE LOADED");
app.use("/api/reminders", reminderRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit", auditRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "RenewGuard API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});