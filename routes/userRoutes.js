// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs'); 
const userController = require('../controllers/user.controller');

const router = express.Router();

// Define routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.put('/update-profile', userController.updateProfile);
router.delete('/delete-account', userController.deleteAccount);
// Add more routes as needed

module.exports = router;

