const express = require('express');
const bcrypt = require('bcryptjs');
const { userController, forgotPassword } = require('../controllers/user.controller');
const passport = require('passport');

const router = express.Router();

// Define routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/update-profile', userController.updateProfile);
router.delete('/delete-account', userController.deleteAccount);
router.get('/auth/google', userController.googleSignup);
router.get('/auth/google/callback', userController.googleCallback);

// New route for forgot password
router.post('/forgot-password', forgotPassword);

module.exports = router;

