const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authMiddleware = require('../middlewares/auth.Middleware');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const nodemailer = require('nodemailer');
dotenv.config();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

// Google strategy callback
const googleStrategyCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user exists based on Google profile ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // If the user doesn't exist, create a new user with Google profile information
      user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        // Add other relevant profile information
        googleId: profile.id,
      });

      await user.save();
    }

    // Pass the user object to the passport callback
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
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
  },

  // Google Signup/Login
  googleSignup: passport.authenticate('google', { scope: ['profile', 'email'] }),
  googleCallback: passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/', // Redirect to the home page after successful login
  }),
};



module.exports = userController;

