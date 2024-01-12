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
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Configure Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  // Check if the user already exists in your database
  try {
    const existingUser = await User.findOne({ googleId: profile.id });

    if (existingUser) {
      // If user exists, generate JWT token and return it
      const token = generateToken(existingUser);
      return done(null, token);
    }

    // If user doesn't exist, create a new user in your database
    const newUser = new User({
      username: profile.displayName,
      email: profile.emails[0].value,
      // Add any additional fields you want to save for the user
      googleId: profile.id,
    });

    await newUser.save();

    // Generate JWT token for the new user
    const token = generateToken(newUser);

    // Return the token
    return done(null, token);
  } catch (error) {
    console.error(error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user for session
passport.deserializeUser((obj, done) => {
  done(null, obj);
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
// Function to verify the user's email
const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.params;

    // Decode the verification token
    let decodedToken;
    try {
      decodedToken = jwt.verify(verificationToken, process.env.VERIFICATION_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ message: 'Verification token has expired.' });
      }
      throw error;
    }

    // Check if the token is valid
    if (!decodedToken || !decodedToken.userId) {
      return res.status(400).json({ message: 'Invalid verification token.' });
    }

    // Update the user's isVerified field in the database
    const user = await User.findByIdAndUpdate(decodedToken.userId, { isVerified: true });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Email verification successful.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const userController = {
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

      // Save the user to the database
      await newUser.save();

      // Generate a verification token
      const verificationToken = jwt.sign({ userId: newUser._id }, process.env.VERIFICATION_SECRET, {
        expiresIn: '1h', // Set an expiration time for the verification token
      });

      // Construct the verification link
      const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

      // Send the verification email
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Email Verification',
        text: `Click the following link to verify your email: ${verificationLink}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: 'Account created successfully. Check your email for verification.' });
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
  updateProfile: async function (req, res) {
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
    // Change Password
  changePassword: async function (req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user._id;

      const user = await User.findById(userId);

      // Check if the current password is valid
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect.' });
      }

      // Update the password
      await user.updatePassword(newPassword);

      res.status(200).json({ message: 'Password updated successfully.' });
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
  
   
  // Google Signup
  googleSignup: passport.authenticate('google', { scope: ['profile', 'email'] }),

  // Google Callback
  googleCallback: passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/', // Redirect to the home page after successful login
  }),
  
  verifyEmail: verifyEmail,
};

module.exports = { userController, forgotPassword };



