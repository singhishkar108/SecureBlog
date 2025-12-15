const Post = require("../models/Post");

// Create a draft (author only)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      status: "draft"
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a draft (author can update their own)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Ownership check: author can update own draft
    if (post.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (post.status === "published" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Cannot edit published post" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Publish post (editor or admin)
exports.publishPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = "published";
    await post.save();

    res.json({ message: "Post published", post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete post (admin only)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.remove();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List all published posts (reader, author, editor, admin)
exports.listPosts = async (req, res) => {
  try {
    const posts =
      req.user.role === "reader"
        ? await Post.find({ status: "published" }).populate("author", "username")
        : await Post.find().populate("author", "username");

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Reader cannot view drafts
    if (post.status === "draft" && req.user.role === "reader") {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
