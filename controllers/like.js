const Like = require('../models/like');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const Comment = require('../models/comment');
const authMiddleware = require('../middlewares/auth.Middleware');

const likeController = {
  // like a post or comment
  like: [authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    // Check if it's a post or a comment
    let parent, parentType;

    if (postId) {
      parent = await Post.findById(postId);
      parentType = 'post';
    } else if (commentId) {
      parent = await Comment.findById(commentId);
      parentType = 'comment';
    } else {
      return res.status(400).json({ message: 'Invalid request.' });
    }

    if (!parent) {
      return res.status(404).json({ message: `${parentType === 'post' ? 'Post' : 'Comment'} not found.` });
    }

    // Check if the user has already liked the post or comment
    const existingLike = await Like.findOne({ [parentType]: parent._id, user: userId });

    if (existingLike) {
      return res.status(400).json({ message: `You have already liked this ${parentType}.` });
    }

    // Create a new like
    const newLikeData = { user: userId, post: null, comment: null };

    // Set the appropriate field based on whether it's a post or a comment
    if (parentType === 'post') {
      newLikeData.post = parent._id;
    } else if (parentType === 'comment') {
      newLikeData.comment = parent._id;
    }

    const newLike = new Like(newLikeData);
    await newLike.save();

    res.status(201).json({ like: newLike });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}],


  // Unlike a Post or Comment
  unlike: [authMiddleware, async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user._id;

      // Check if it's a post or a comment
      let parent, parentType;

      if (postId) {
        parent = await Post.findById(postId);
        parentType = 'post';
      } else if (commentId) {
        parent = await Comment.findById(commentId);
        parentType = 'comment';
      } else {
        return res.status(400).json({ message: 'Invalid request.' });
      }

      if (!parent) {
        return res.status(404).json({ message: `${parentType === 'post' ? 'Post' : 'Comment'} not found.` });
      }

      // Check if the like exists
      const existingLike = await Like.findOneAndDelete({ [parentType]: parent._id, user: userId });

      if (!existingLike) {
        return res.status(400).json({ message: `You have not liked this ${parentType}.` });
      }

      res.status(200).json({ message: `Like removed successfully from ${parentType}.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Likes for a Post or Comment
  listLikes: async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      // Check if it's a post or a comment
      let parent, parentType;

      if (postId) {
        parent = await Post.findById(postId);
        parentType = 'post';
      } else if (commentId) {
        parent = await Comment.findById(commentId);
        parentType = 'comment';
      } else {
        return res.status(400).json({ message: 'Invalid request.' });
      }

      if (!parent) {
        return res.status(404).json({ message: `${parentType === 'post' ? 'Post' : 'Comment'} not found.` });
      }

      // Get the likes for the post or comment
      const likes = await Like.find({ [parentType]: parent._id }).populate('user');

      res.status(200).json({ likes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = likeController;
