// backend/src/server.js

// Load .env into process.env
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// Connect to MongoDB before handling any requests
connectDB();

// 2. Enable CORS for your React dev server
//    Change the origin as needed for production.
app.use(cors({ origin: "http://localhost:3000" }));

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

app.use("/api/auth", require("./routes/auth"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Read PORT from environment or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
