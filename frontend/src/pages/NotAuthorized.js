// src/pages/NotAuthorized.js
import React from "react";

/**
 * NotAuthorized renders when a logged‑in user
 * tries to visit a route their role does not permit.
 */
export default function NotAuthorized() {
  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1>403 Forbidden</h1>
      <p>Sorry, you don’t have permission to view this page.</p>
    </div>
  );
}
