// backend/src/middleware/auth.js

const jwt = require("jsonwebtoken");

/**
 * auth middleware:
 * - Checks for a JWT in the Authorization header.
 * - Verifies it and, if valid, puts decoded user info on req.user.
 * - Otherwise returns 401.
 */
module.exports = function (req, res, next) {
  // 1. Get the header value
  const header = req.header("Authorization");
  if (!header) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  // 2. Header should look like: "Bearer eyJ..."
  //    Split on space to get the token part.
  const parts = header.split(" ");
  const token = parts.length === 2 ? parts[1] : null;

  if (!token) {
    return res.status(401).json({ msg: "Malformed token, access denied" });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Save user info (id & role) from token into req.user
    req.user = decoded.user;
    // 5. All good—go to the next handler
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token invalid or expired" });
  }
};
