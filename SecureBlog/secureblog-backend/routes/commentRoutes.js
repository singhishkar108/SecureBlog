const express = require("express");
const router = express.Router({ mergeParams: true }); // merge postId param
const commentController = require("../controllers/commentController");
const { protect, requireRole } = require("../middleware/authMiddleware");

// Add comment (any authenticated user can comment)
router.post("/", protect, requireRole("reader", "author", "editor", "admin"), commentController.addComment);

// List approved comments
router.get("/", protect, commentController.listComments);

// Approve comment (editors/admins)
router.post("/:commentId/approve", protect, requireRole("editor", "admin"), commentController.approveComment);

module.exports = router;
