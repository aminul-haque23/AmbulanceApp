// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

/**
 * Home is the default page at "/".
 * It links to Registration and Login pages.
 */
export default function Home() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Welcome to MERN Auth App</h1>
      <p>
        <Link to="/registration">Go to Registration</Link>
      </p>
      <p>
        <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
}
