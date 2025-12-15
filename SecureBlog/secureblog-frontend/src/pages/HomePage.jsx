// // src/pages/HomePage.jsx
// import React from "react";

// export default function HomePage() {
//   return <h2>Welcome to SecureBlog</h2>;
// }

// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api"; // axios setup with baseURL

export default function HomePage() {
  const [testMsg, setTestMsg] = useState("");

  useEffect(() => {
    API.get("/test")
      .then((res) => setTestMsg(res.data.message))
      .catch((err) => {
        console.error("Error fetching from backend:", err);
        setTestMsg("Failed to fetch from backend");
      });
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h2>Welcome to Secure Blog</h2>
      <p>Backend says: {testMsg}</p>
    </div>
  );
}
