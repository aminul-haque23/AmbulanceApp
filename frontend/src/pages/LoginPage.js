// src/pages/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * LoginPage renders a simple login form and handles authentication.
 * - Tracks email & password inputs
 * - Sends credentials to the backend /api/auth/login
 * - Displays the JWT or error response
 */
export default function LoginPage() {
  // 1️⃣ State for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // 2️⃣ State for output (success/error messages)
  const [output, setOutput] = useState("");

  // 3️⃣ Update formData when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4️⃣ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setOutput("⏳ Logging in..."); // Show loading message

    try {
      // Send POST to backend login endpoint
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json(); // Parse JSON response

      if (res.ok && data.token) {
        // Success: display token and optionally save it
        localStorage.setItem("token", data.token);

        // 2️⃣ Decode the payload part of the JWT
        //    JWT format: header.payload.signature
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        //    payload.user.role now holds 'user' | 'driver' | 'admin'
        const role = payload.user.role;

        // 3️⃣ Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "driver") {
          navigate("/driver/dashboard");
        } else {
          navigate("/user/dashboard");
        }

        setOutput("✅ Login successful! Token saved.");
      } else {
        // Failure: display error message
        setOutput("❌ Error: " + (data.msg || data.error || "Login failed"));
      }
    } catch (err) {
      setOutput("❌ Network error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        {/* EMAIL INPUT */}
        <div>
          <label>
            Email:
            <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        {/* PASSWORD INPUT */}
        <div>
          <label>
            Password:
            <br />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <br />

        <button type="submit">Login</button>
      </form>

      {/* OUTPUT BOX */}
      <pre
        style={{ background: "#f4f4f4", padding: "1rem", marginTop: "2rem" }}
      >
        {output}
      </pre>
    </div>
  );
}
