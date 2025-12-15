const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { protect, requireRole, requireSelfOrRole } = require("../middleware/authMiddleware");

// CRUD for posts
router.post("/", protect, requireRole("author"), postController.createPost);

// Authors can update their own posts; admins can update any
router.put("/:id", protect, requireSelfOrRole("author", "admin"), postController.updatePost);

// Editors and admins can publish posts
router.post("/:id/publish", protect, requireRole("editor", "admin"), postController.publishPost);

// Only admins can delete
router.delete("/:id", protect, requireRole("admin"), postController.deletePost);

// Read
router.get("/", protect, postController.listPosts);
router.get("/:id", protect, postController.getPost);

module.exports = router;
