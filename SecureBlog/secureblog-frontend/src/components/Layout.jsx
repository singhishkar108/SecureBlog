// src/components/Layout.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  const isLoggedIn = () => !!localStorage.getItem("token");

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>{" "}
        {isLoggedIn() ? (
          <>
            <Link to="/dashboard">Dashboard</Link>{" "}
            <Link to="/logout">Logout</Link>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>{" "}
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
      <hr />
      <main>{children}</main>
    </div>
  );
}
