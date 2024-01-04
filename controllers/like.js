const Like = require('../models/like.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/authMiddleware');

const likeController = {
  // Like a Post
  likePost: [authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Check if the user has already liked the post
      const existingLike = await Like.findOne({ post: postId, user: userId });
      if (existingLike) {
        return res.status(400).json({ message: 'You have already liked this post.' });
      }

      const newLike = new Like({ post: postId, user: userId });
      await newLike.save();

      res.status(201).json({ like: newLike });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Unlike a Post
  unlikePost: [authMiddleware, async (req, res) => {
    try {
      const { postId } = req.params;
      const userId = req.user._id;

      // Check if the like exists
      const existingLike = await Like.findOne({ post: postId, user: userId });
      if (!existingLike) {
        return res.status(400).json({ message: 'You have not liked this post.' });
      }

      // Delete the like
      await existingLike.remove();

      res.status(200).json({ message: 'Like removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Likes for a Post
  listLikes: async (req, res) => {
    try {
      const { postId } = req.params;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Get the likes for the post
      const likes = await Like.find({ post: postId }).populate('user');

      res.status(200).json({ likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = likeController;

