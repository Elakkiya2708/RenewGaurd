const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("RenewGuard API is running");
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});