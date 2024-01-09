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

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate a reset token and set an expiration time
    const resetToken = jwt.sign({ userId: user._id }, process.env.RESET_SECRET, { expiresIn: '1h' });

    // Save the reset token and expiration time to the user document
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send an email with the reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset instructions sent to your email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// User controller
const userController = {
  // Signup
  signup: async function (req, res) {
    try {
      const { username, email, password } = req.body;

      // Check if the username or email already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists.' });
      }

      // Create a new user
      const newUser = new User({ username, email, password });
      await newUser.save();

      // Generate JWT token
      const token = generateToken(newUser);

      // Return the token and user information
      res.status(201).json({ token, user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Login
  login: async function (req, res) {
    try {
      const { username, password } = req.body;

      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      // Check if the password is valid
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password.' });
      }

      // Generate JWT token
      const token = generateToken(user);

      // Return the token and user information
      res.status(200).json({ token, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Profile
  updateProfile: authMiddleware, async function (req, res) {
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
  deleteAccount: authMiddleware, async function (req, res) {
    try {
      const userId = req.user._id;

      // Delete the user account
      await User.findByIdAndDelete(userId);

      // Return a success message
      res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

};

module.exports = { userController, forgotPassword, googleSignup, googleCallback };

