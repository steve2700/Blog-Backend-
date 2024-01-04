const Post = require('../models/post.model');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Comment = require('../models/comment.model');
const authMiddleware = require('../middlewares/auth.Middleware');

const postController = {
  // Create Post
  createPost: [authMiddleware, async (req, res) => {
    try {
      const { title, content, categories, imageUrl } = req.body;
      const authorId = req.user._id;

      // Check if categories exist
      const existingCategories = await Category.find({ _id: { $in: categories } });
      if (existingCategories.length !== categories.length) {
        return res.status(400).json({ message: 'One or more categories do not exist.' });
      }

      const newPost = new Post({
        title,
        content,
        author: authorId,
        categories,
        imageUrl,
      });

      await newPost.save();

      res.status(201).json({ post: newPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Get Single Post
  getPost: async (req, res) => {
    try {
      const postId = req.params.postId;

      const post = await Post.findById(postId).populate('author categories comments');

      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      res.status(200).json({ post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // List Posts
  listPosts: async (req, res) => {
    try {
      const posts = await Post.find().populate('author categories');

      res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Post
  updatePost: [authMiddleware, async (req, res) => {
    try {
      const postId = req.params.postId;
      const { title, content, categories, imageUrl } = req.body;
      const authorId = req.user._id;

      // Check if the user is the author of the post
      const post = await Post.findById(postId);
      if (!post || post.author.toString() !== authorId.toString()) {
        return res.status(403).json({ message: 'You do not have permission to update this post.' });
      }

      // Check if categories exist
      const existingCategories = await Category.find({ _id: { $in: categories } });
      if (existingCategories.length !== categories.length) {
        return res.status(400).json({ message: 'One or more categories do not exist.' });
      }

      // Update the post
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, content, categories, imageUrl },
        { new: true }
      ).populate('author categories comments');

      res.status(200).json({ post: updatedPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Delete Post
  deletePost: [authMiddleware, async (req, res) => {
    try {
      const postId = req.params.postId;
      const authorId = req.user._id;

      // Check if the user is the author of the post
      const post = await Post.findById(postId);
      if (!post || post.author.toString() !== authorId.toString()) {
        return res.status(403).json({ message: 'You do not have permission to delete this post.' });
      }

      // Delete the post
      await post.remove();

      res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],
};

module.exports = postController;

