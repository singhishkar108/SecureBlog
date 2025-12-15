// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

// Import validator rules and controller
const { registerRules, loginRules } = require("../src/utils/validators");
const authController = require("../controllers/authController");

// Import our custom rate limiters
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");

// Apply rate limiters to the appropriate endpoints

// Registration endpoint: limits bot/mass registration
router.post("/register", registerLimiter, registerRules, authController.register);

// Login endpoint: limits brute-force attempts
router.post("/login", loginLimiter, loginRules, authController.login);

module.exports = router;
