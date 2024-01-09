const bcrypt = require('bcryptjs'); // Updated import
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authMiddleware = require('../middlewares/auth.Middleware');

dotenv.config();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

// User controller
const userController = {
  // Signup
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists.' });
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      const token = generateToken(newUser);
      res.status(201).json({ token, user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Login
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      const token = generateToken(user);
      res.status(200).json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Profile
  updateProfile: authMiddleware, async function(req, res) {
    try {
      const { username, email, profile } = req.body;
      const userId = req.user._id;

      const existingUser = await User.findOne({ $and: [{ _id: { $ne: userId } }, { $or: [{ username }, { email }] }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists.' });
      }

      const updatedUser = await User.findByIdAndUpdate(userId, { username, email, profile }, { new: true });

      res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete Account
  deleteAccount: authMiddleware, async function(req, res) {
    try {
      const userId = req.user._id;

      await User.findByIdAndDelete(userId);

      res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = userController;

