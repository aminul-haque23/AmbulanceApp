// src/components/PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    // Decode and pick the right dashboard
    let role = null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.user.role;
    } catch {
      // If token malformed, clear it
      localStorage.removeItem("token");
      return children;
    }
    // Redirect based on role
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "driver") return <Navigate to="/driver/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }
  // Not logged in → render the page
  return children;
}
