const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load env
dotenv.config();

// Connect DB
connectDB();

// Init app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", require("./routes/index"));

// Base route
app.get("/", (req, res) => {
  res.send("Handyman Booking API is running...");
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
