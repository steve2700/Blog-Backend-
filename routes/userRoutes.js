// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs'); 
const userController = require('../controllers/user.controller');
const passport = require('passport');

const router = express.Router();

// Define routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/update-profile', userController.updateProfile);
router.delete('/delete-account', userController.deleteAccount);
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Redirect or send response after successful login
  res.redirect('/');
});

module.exports = router;

