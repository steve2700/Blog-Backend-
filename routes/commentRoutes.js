const express = require('express');
const commentController = require('../controllers/comment.controller');

const router = express.Router();

// Create Comment
router.post('/', commentController.createComment);

// Update Comment
router.put('/:commentId', commentController.updateComment);

// Delete Comment
router.delete('/:commentId', commentController.deleteComment);

// List Comments for a Post
router.get('/:postId', commentController.listComments);

module.exports = router;

