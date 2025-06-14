// src/pages/NotFound.js
import React from "react";

/**
 * NotFound renders whenever the user navigates
 * to a route that doesn't exist.
 */
export default function NotFound() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial", textAlign: "center" }}>
      <h1>404</h1>
      <p>Oops! The page you’re looking for doesn’t exist.</p>
    </div>
  );
}
