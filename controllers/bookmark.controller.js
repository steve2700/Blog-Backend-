const Bookmark = require('../models/bookmark.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/auth.middleware');

const bookmarkController = {
  // Bookmark a Post
  bookmarkPost: [authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;  // Extract postId from URL params
      const userId = req.user._id;    // Extract userId from authenticated user

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Check if the user has already bookmarked the post
      const existingBookmark = await Bookmark.findOne({ post: postId, user: userId });
      if (existingBookmark) {
        return res.status(400).json({ message: 'You have already bookmarked this post.' });
      }

      // Create a new bookmark
      const newBookmark = new Bookmark({ post: postId, user: userId });
      await newBookmark.save();

      res.status(201).json({ bookmark: newBookmark });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Unbookmark a Post
  unbookmarkPost: [authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;  // Extract postId from URL params
      const userId = req.user._id;    // Extract userId from authenticated user

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Check if the bookmark exists
      const existingBookmark = await Bookmark.findOneAndDelete({ post: postId, user: userId });
      if (!existingBookmark) {
        return res.status(400).json({ message: 'You have not bookmarked this post.' });
      }

      res.status(200).json({ message: 'Bookmark removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Bookmarks for a User
  listBookmarks: [authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;  // Extract userId from authenticated user

      // Get the bookmarks for the user
      const bookmarks = await Bookmark.find({ user: userId }).populate('post');

      res.status(200).json({ bookmarks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }]
};

module.exports = bookmarkController;

