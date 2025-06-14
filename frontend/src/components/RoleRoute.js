// src/components/RoleRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import NotAuthorized from "../pages/NotAuthorized";

/**
 * RoleRoute guards a route so that only users with
 * specified roles can view it.
 *
 * Props:
 *  - allowedRoles: array of strings, e.g. ['admin']
 *  - children: the component(s) to render if allowed
 */
export default function RoleRoute({ allowedRoles, children }) {
  // 1️⃣ Check for token
  const token = localStorage.getItem("token");
  if (!token) {
    // Not logged in → go to login
    return <Navigate to="/" replace />;
  }

  try {
    // 2️⃣ Decode JWT payload (middle segment)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 3️⃣ Extract user role
    const role = payload.user.role;

    // 4️⃣ Check if this role is permitted
    if (!allowedRoles.includes(role)) {
      // Role not in the allowed list → send to a “403” or home
      return <NotAuthorized />;
    }

    // 5️⃣ Role is allowed → render the protected component
    return children;
  } catch (err) {
    // Malformed token… treat as not logged in
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
