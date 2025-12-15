const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add comment (reader)
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      post: post._id,
      user: req.user.id,
      content,
      approved: false
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List approved comments
exports.listComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, approved: true }).populate("user", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve comment (editor/admin)
exports.approveComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.approved = true;
    await comment.save();

    res.json({ message: "Comment approved", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
