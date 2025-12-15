const http = require("http"); // use HTTP in Docker
const https = require("https");
const fs = require("fs");
const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Only use HTTPS if explicitly enabled (local dev with certs)
const useHttps = process.env.USE_HTTPS === "true";

let server;

// Start MongoDB connection, then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    if (useHttps) {
      // Local dev HTTPS
      const sslOptions = {
        key: fs.readFileSync("ssl/privatekey.pem"),
        cert: fs.readFileSync("ssl/certificate.pem")
      };
      server = https.createServer(sslOptions, app);
      server.listen(PORT, "0.0.0.0", () => {
        console.log(`Secure server running at https://localhost:${PORT}`);
      });
    } else {
      // Docker & default → plain HTTP
      server = http.createServer(app);
      server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running at http://0.0.0.0:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
