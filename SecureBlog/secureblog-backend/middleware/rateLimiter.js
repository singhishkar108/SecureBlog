// secureblog-backend/middleware/rateLimiter.js

const rateLimit = require("express-rate-limit");

// Helper: get real client IP (proxy-aware)
const keyByIp = (req) => {
  return (
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    "unknown"
  );
};

// Register limiter: limit registration attempts per IP
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false, // no X-RateLimit-* headers
  keyGenerator: keyByIp,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many registration attempts. Please try again later."
    });
  }
});

// Login limiter: limit per IP + email, skip successful logins
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // successful logins don’t count
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    return `${keyByIp(req)}:${email}`;
  },
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Please try again later."
    });
  }
});

module.exports = { registerLimiter, loginLimiter };
