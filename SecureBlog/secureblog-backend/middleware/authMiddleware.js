const jwt = require("jsonwebtoken");

// Protect routes: verify JWT and attach user to req
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalid or expired" });
  }
};

// Middleware to restrict access to certain roles
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }
  next();
};

// Middleware to allow resource owner or a specific role
const requireSelfOrRole = (role) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Assuming the resource's owner ID is in req.params.id
  if (req.user.id === req.params.id || req.user.role === role) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden: not owner or role" });
};

module.exports = { protect, requireRole, requireSelfOrRole };
