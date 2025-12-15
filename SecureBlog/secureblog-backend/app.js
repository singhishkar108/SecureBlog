// backend/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Enable trust proxy for real client IPs (important for rate limiting behind proxies)
app.set("trust proxy", 1);

// Determine environment
const isDev = process.env.NODE_ENV !== "production";

// Parse JSON bodies (including CSP violation reports if needed)
app.use(express.json({ type: ["application/json", "application/csp-report"] }));

// 1) Baseline security headers
app.use(helmet());

// 2) Content Security Policy (production-ready)
const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "https://apis.google.com"],
  styleSrc: ["'self'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'", "http://localhost:5000", "https://api.example.com"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: []
};

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: cspDirectives,
    reportOnly: isDev // report-only in dev, enforce in production
  })
);

console.log(`CSP mode: ${isDev ? "REPORT-ONLY (dev)" : "ENFORCED (prod)"}`);

// 3) CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://localhost:5173"], // dev frontend
    credentials: true
  })
);

// 4) Import routes and middleware
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { protect } = require("./middleware/authMiddleware");

// Import rate limiters
const { registerLimiter, loginLimiter } = require("./middleware/rateLimiter");

// 5) Apply rate limiters to auth routes
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/register-user", registerLimiter);
app.use("/api/auth/register-admin", registerLimiter);

// 6) Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/posts", protect, postRoutes);
app.use("/api/posts/:postId/comments", protect, commentRoutes);

// 7) Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: `Welcome, user ${req.user.id}!`,
    role: req.user.role,
    timestamp: new Date()
  });
});

// 8) Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

module.exports = app;
