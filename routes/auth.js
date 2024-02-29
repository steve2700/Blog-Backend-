// routes/auth.js
const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');
const multer = require('multer');

const router = express.Router();

router.post('/signup', authController.signup);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/upload-profile-image', authMiddleware, upload.single('profileImage'), authController.uploadProfileImage);
router.delete('/delete-account', authMiddleware, authController.deleteAccount);


module.exports = router;

