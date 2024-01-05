// routes/userRoutes.js

const express = require('express');
const userController = require('../controllers/user.controller');

const router = express.Router();

// Define routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
// Add more routes as needed

module.exports = router;

