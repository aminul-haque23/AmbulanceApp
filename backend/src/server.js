// backend/src/server.js

// Load .env into process.env
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect to MongoDB before handling any requests
connectDB();

const FRONTEND_URL = process.env.FRONTEND_URL || "*";

// 2. Enable CORS for your React dev server
//    Change the origin as needed for production.
app.use(
  cors({
    origin: FRONTEND_URL,
  })
);

// Built‑in middleware to parse incoming JSON payloads
app.use(express.json());

/**
 * Health‑check endpoint
 * GET /api/ping
 * Responds with a simple JSON message so you can verify the server is up.
 */
app.get("/api/ping", (req, res) => {
  res.json({ msg: "pong" });
});

app.get("/", (req, res) => {
  res.send("🚑 Backend is running.");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Read PORT from environment or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
