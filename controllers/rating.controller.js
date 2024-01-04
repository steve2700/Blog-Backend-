const Rating = require('../models/rating.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/authMiddleware');

const ratingController = {
  // Rate a Post
  ratePost: [authMiddleware, async (req, res) => {
    try {
      const userId = req.user._id;
      const { postId, value } = req.body;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Check if the user has already rated the post
      const existingRating = await Rating.findOne({ post: postId, user: userId });
      if (existingRating) {
        return res.status(400).json({ message: 'You have already rated this post.' });
      }

      // Create a new rating
      const newRating = new Rating({ post: postId, user: userId, value });
      await newRating.save();

      // Calculate the average rating for the post and update the post model
      const ratings = await Rating.find({ post: postId });
      const totalRatings = ratings.length;
      const sumRatings = ratings.reduce((sum, rating) => sum + rating.value, 0);
      const averageRating = sumRatings / totalRatings;

      post.averageRating = averageRating;
      await post.save();

      res.status(201).json({ rating: newRating });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Ratings for a Post
  listRatings: async (req, res) => {
    try {
      const { postId } = req.params;

      // Check if the post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Get the ratings for the post
      const ratings = await Rating.find({ post: postId }).populate('user');

      res.status(200).json({ ratings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = ratingController;

