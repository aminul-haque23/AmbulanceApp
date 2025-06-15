// src/pages/UserDashboard.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * UserDashboard loads the user’s profile and displays their name,
 * plus provides a Logout button to clear the token and redirect.
 */
export default function UserDashboard() {
  const navigate = useNavigate();

  // State for user data and potential error
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json().then((data) => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status === 200) {
          setUser(data);
        } else if (status === 401) {
          // Token invalid/expired
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(data.msg || "Failed to load profile");
        }
      })
      .catch(() => setError("Network error"));
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Render error or loading states
  if (error) {
    return (
      <div style={{ padding: "2rem", fontFamily: "Arial" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }
  if (!user) {
    return <div style={{ padding: "2rem", fontFamily: "Arial" }}>Loading…</div>;
  }

  // Main dashboard UI
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Hello, {user.name}!</h1>
      <p>
        Your role: <em>{user.role}</em>
      </p>
      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}
