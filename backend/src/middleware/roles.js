// backend/src/middleware/roles.js

/**
 * Role‑based authorization middleware.
 * @param {string[]} allowedRoles  e.g. ['admin'], or ['user','driver']
 */
module.exports = function (allowedRoles = []) {
  return (req, res, next) => {
    // req.user was set by auth middleware
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access denied: insufficient rights" });
    }
    next();
  };
};
