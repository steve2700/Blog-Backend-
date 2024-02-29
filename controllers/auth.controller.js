// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/user.model');
const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json')
const upload = require('../middlewares/upload');
const stream = require('stream');

require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://profile-image-url.appspot.com', // firebase storage updated
});


const jwtSecret = process.env.JWT_SECRET;

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const bucket = admin.storage().bucket();
// Signup
exports.signup = async (req, res, next) => {
  const { username, password, email } = req.body;

  // Strengthened password criteria
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!username || !password || !email) {
    return res.status(422).json({ error: 'Username, password, and email are required.' });
  }

  // Check if the password meets the criteria
  if (!passwordRegex.test(password)) {
    return res.status(422).json({
      error: 'Password must have 8 or more characters, at least one uppercase letter, one lowercase letter, one digit, and one special character.',
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(422).json({ error: 'Username or email is already taken.' });
    }

    const user = new User({ username, password, email });
    await user.save();

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    await user.save();

    // Send email verification link
    const verificationLink = `${process.env.APP_BASE_URL}/auth/verify-email/${emailVerificationToken}`;

    const mailOptions = {
      from: 'blogpostbackend@gmail.com',
      to: user.email,
      subject: 'BlogPost - Verify Your Email',
      html: `Click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Email verification email failed to send:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'User registered successfully. Check your email for verification.' });
    });
  } catch (error) {
    next(error);
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(404).json({ error: 'Invalid verification token.' });
    }

    // Mark the user as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now sign in.' });
  } catch (error) {
    console.error('Email verification failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login
exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ error: 'Email not verified. Please check your email for verification instructions.' });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // If username and password are correct, generate a JWT token
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, jwtSecret, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};


// forgot Password
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Generate password reset token
    const passwordResetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send password reset link
    const resetLink = `${process.env.APP_BASE_URL}/auth/reset-password/${passwordResetToken}`;

    const mailOptions = {
      from: 'blogpostbackend@gmail.com',
      to: user.email,
      subject: 'BlogPost - Reset Your Password',
      html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Password reset email failed to send:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json({ message: 'Password reset instructions sent to your email.' });
    });
  } catch (error) {
    next(error);
  }
};
exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      return res.status(404).json({ error: 'Invalid or expired password reset token.' });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
  } catch (error) {
    console.error('Password reset failed:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//upload profile picture
exports.uploadProfileImage = async function(req, res) {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const destination = `profile-images/${userId}/${file.originalname}`;
    const uploadOptions = {
      destination,
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    };

    // Create a writable stream
    const fileStream = bucket.file(destination).createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Pipe the buffer into the writable stream
    fileStream.end(file.buffer);

    // Wait for the upload to finish
    await new Promise((resolve, reject) => {
      fileStream.on('error', reject);
      fileStream.on('finish', resolve);
    });

    // Get the signed URL
    const [url] = await bucket.file(destination).getSignedUrl({ action: 'read', expires: '01-01-2500' });

    await User.findByIdAndUpdate(userId, { profileImageUrl: url });

    res.status(200).json({ message: 'Profile image uploaded successfully.', imageUrl: url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
   // Delete Account
exports.deleteAccount = async function (req, res)  {
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
};



