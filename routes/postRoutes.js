const express = require('express');
const multer = require('multer');
const path = require('path');
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.Middleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the filename
  },
});

const upload = multer({ storage });

// Routes for post operations
// Create Post with image upload
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// Get Single Post
router.get('/:postId', postController.getPost);

// List Posts
router.get('/', postController.listPosts);

// Update Post with image upload
router.put('/:postId', authMiddleware, upload.single('image'), postController.updatePost);

// Delete Post
router.delete('/:postId', authMiddleware, postController.deletePost);

module.exports = router;

