const Comment = require('../models/comment');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.Middleware');

const commentController = {
  // Create Comment
  createComment: [authMiddleware, async (req, res) => {
    try {
      const { postId, text } = req.body;
      const userId = req.user._id;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      const newComment = new Comment({ text, author: userId, post: postId });
      await newComment.save();

      // Add the comment to the post
      post.comments.push(newComment);
      await post.save();

      res.status(201).json({ comment: newComment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Update Comment
  updateComment: [authMiddleware, async (req, res) => {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const userId = req.user._id;

      // Check if the comment exists
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }

      // Check if the user is the author of the comment
      if (comment.author.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'You do not have permission to update this comment.' });
      }

      // Update the comment
      comment.text = text;
      await comment.save();

      res.status(200).json({ comment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Delete Comment
  deleteComment: [authMiddleware, async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      // Check if the comment exists
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found.' });
      }

      // Check if the user is the author of the comment
      if (comment.author.toString() !== userId.toString()) {
        return res.status(403).json({ message: 'You do not have permission to delete this comment.' });
      }

      // Delete the comment
      await Comment.deleteOne({ _id: commentId });

      res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Comments for a Post
  listComments: async (req, res) => {
    try {
      const { postId } = req.params;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Get the comments for the post
      const comments = await Comment.find({ _id: { $in: post.comments } }).populate('author');

      res.status(200).json({ comments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = commentController;

