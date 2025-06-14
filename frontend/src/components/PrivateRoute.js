// src/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  // 1️⃣ Get the token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    // No token → not logged in
    return <Navigate to="/" replace />;
  }

  try {
    // 2️⃣ Decode the payload (second segment of the JWT)
    const payload = JSON.parse(atob(token.split(".")[1]));

    // 3️⃣ exp is in seconds since Unix epoch
    const now = Date.now() / 1000; // seconds

    if (payload.exp < now) {
      // 4️⃣ Token has expired
      localStorage.removeItem("token"); // remove stale token
      return <Navigate to="/" replace />; // send back to homepage
    }

    // 5️⃣ Still valid → render the protected component
    return children;
  } catch (err) {
    // If anything goes wrong (malformed token), treat as not logged in
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }
}
