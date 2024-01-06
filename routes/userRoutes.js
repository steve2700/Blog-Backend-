// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Define routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/update-profile', userController.updateProfile);  // Use PUT method for updating profiles
router.delete('/delete-account', userController.deleteAccount); // Use DELETE method for deleting accounts
// Add more routes as needed

module.exports = router;

