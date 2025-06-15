// src/pages/RegisterPage.js
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

export default function RegisterPage() {
  //
  // 1️⃣ INITIAL STATE: include every field you’ll ever need
  //
  const [formData, setFormData] = useState({
    name: "", // will bind to the "name" input
    email: "", // will bind to the "email" input
    password: "", // will bind to the "password" input
    role: "user", // will bind to the "role" select
  });
  const navigate = useNavigate();

  const [output, setOutput] = useState(""); // for messages

  //
  // 2️⃣ HANDLE CHANGE: ALWAYS merge into existing formData
  //
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Merge the new [name]: value into the full formData object
    setFormData((prev) => ({
      ...prev, // copy all existing fields
      [name]: value, // overwrite just the one that changed
    }));
  };

  //
  // 3️⃣ HANDLE SUBMIT: show what’s going out and send it
  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOutput("⏳ Registering…");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setOutput("✅ Registered! Redirecting to login…");
        setTimeout(() => navigate("/login"), 500);
      } else {
        setOutput("❌ Error: " + (data.msg || data.error || "Unknown error"));
      }
    } catch (err) {
      setOutput("❌ Network error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>📝 Register</h2>
      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <div>
          <label>
            Name:
            <br />
            <input
              type="text"
              name="name" // must match state key
              value={formData.name} // drives the input
              onChange={handleChange} // updates state
              required
            />
          </label>
        </div>
        <br />

        {/* EMAIL */}
        <div>
          <label>
            Email:
            <br />
            <input
              type="email"
              name="email" // must match state key
              value={formData.email} // drives the input
              onChange={handleChange} // updates state
              required
            />
          </label>
        </div>
        <br />

        {/* PASSWORD */}
        <div>
          <label>
            Password:
            <br />
            <input
              type="password"
              name="password" // must match state key
              value={formData.password} // drives the input
              onChange={handleChange} // updates state
              required
            />
          </label>
        </div>
        <br />

        {/* ROLE SELECT */}
        <div>
          <label>
            Role:
            <br />
            <select
              name="role" // must match state key
              value={formData.role} // drives the select
              onChange={handleChange} // updates state
            >
              <option value="user">user</option>
              <option value="driver">driver</option>
              <option value="admin">admin</option>
            </select>
          </label>
        </div>
        <br />

        <button type="submit">Register</button>
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
