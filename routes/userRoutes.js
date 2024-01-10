const express = require('express');
const router = express.Router();
const passwordValidator = require('password-validator');
const { userController, forgotPassword } = require('../controllers/user.controller');

// Create a password schema
const passwordSchema = new passwordValidator();
passwordSchema
  .is().min(6)            // Minimum length 6
  .has().uppercase()      // Must have uppercase letters
  .has().lowercase()      // Must have lowercase letters
  .has().digits(1)        // Must have at least 1 digit
  .has().symbols(1)       // Must have at least 1 symbol
  .is().not().spaces();   // Should not have spaces

// Signup route
router.post('/signup', (req, res, next) => {
  // Validate password
  const password = req.body.password;
  const isPasswordValid = passwordSchema.validate(password);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: 'Password does not meet the required criteria.',
      errors: passwordSchema.validate(password, { list: true }),
    });
  }

  // Continue with signup logic if password is valid
  userController.signup(req, res, next);
});


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

