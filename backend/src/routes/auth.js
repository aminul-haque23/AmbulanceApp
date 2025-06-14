const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ msg: "name, email and password are required" });
  }

  const allowedRoles = ["user", "driver", "admin"];
  if (role && !allowedRoles.includes(role)) {
    return res
      .status(400)
      .json({ msg: `Role must be one of: user, driver, admin` });
  }

  try {
    let existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "A user with that email already exists" });
    }
    const user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Register error:", err);
    // Send JSON so the frontend .json() call always works
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and issue a JWT
 * @access  Public
 */

router.post("/login", async (req, res) => {
  // 1) Extract credentials from request
  const { email, password } = req.body;

  // 2) Simple validation: both fields are required
  if (!email || !password) {
    return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
    // 3) Look up the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // No such user
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 4) Compare plaintext password to the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Password does not match
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 5) Build the JWT payload with user ID and role
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // 6) Sign the token and return it
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "10h" },
      (err, token) => {
        if (err) throw err;
        // Send back the token; client will store it
        res.json({ token });
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    // Consistent error response format
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Return current user info (no password)
 * @access  Private
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GET /me error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
