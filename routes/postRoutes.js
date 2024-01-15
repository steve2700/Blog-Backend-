const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

// Create Post
router.post('/', postController.createPost);

// Get Single Post
router.get('/:postId', postController.getPost);

// List Posts
router.get('/', postController.listPosts);

// Update Post
router.put('/:postId', postController.updatePost);

// Delete Post
router.delete('/:postId', postController.deletePost);

module.exports = router;

