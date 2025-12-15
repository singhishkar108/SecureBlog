// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { isValidEmail, isStrongPassword } from "../utils/validators";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState(""); // Optional if your backend supports it
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    // Client-side validation
    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Invalid email format.");
      return;
    }
    if (!isStrongPassword(password)) {
      setMessage("Password must be at least 8 characters and include letters and numbers.");
      return;
    }
    if (username && (username.length < 3 || username.length > 40)) {
      setMessage("Username must be between 3 and 40 characters.");
      return;
    }

    // Call API if validation passes
    try {
      const res = await API.post("/auth/register", { email, password, username });
      localStorage.setItem("token", res.data.token);
      setMessage("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username (optional)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br/>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br/>
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
