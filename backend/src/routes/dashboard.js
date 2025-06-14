// backend/src/routes/dashboard.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/roles");

/**
 * @route   GET /api/dashboard/user
 * @desc    User dashboard (only 'user' role)
 * @access  Private
 */
router.get("/user", auth, permit(["user"]), (req, res) => {
  res.json({ msg: `Welcome User ${req.user.id}!` });
});

/**
 * @route   GET /api/dashboard/driver
 * @desc    Driver dashboard (only 'driver' role)
 * @access  Private
 */
router.get("/driver", auth, permit(["driver"]), (req, res) => {
  res.json({ msg: `Welcome Driver ${req.user.id}!` });
});

/**
 * @route   GET /api/dashboard/admin
 * @desc    Admin dashboard (only 'admin' role)
 * @access  Private
 */
router.get("/admin", auth, permit(["admin"]), (req, res) => {
  res.json({ msg: `Welcome Admin ${req.user.id}!` });
});

module.exports = router;
