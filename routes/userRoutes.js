const express = require('express');
const router = express.Router();
const { userController, forgotPassword, googleSignup, googleCallback } = require('../controllers/user.controller');

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Update Profile route
router.put('/update-profile', userController.updateProfile);

// Delete Account route
router.delete('/delete-account', userController.deleteAccount);

// Forgot Password route
router.post('/forgot-password', forgotPassword);

// Google Signup route
router.get('/google/signup', userController.googleSignup);

// Google Callback route
router.get('/google/callback', userController.googleCallback);

module.exports = router;

