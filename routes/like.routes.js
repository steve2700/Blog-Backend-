const express = require('express');
const likeController = require('../controllers/like');
const authMiddleware = require('../middlewares/auth.Middleware');

const router = express.Router();

// Like a Post or Comment
router.post('/posts/:postId/like', authMiddleware, likeController.like);
router.post('/comments/:commentId/like', authMiddleware, likeController.like);

// Unlike a Post or Comment
router.delete('/posts/:postId/unlike', authMiddleware, likeController.unlike);
router.delete('/comments/:commentId/unlike', authMiddleware, likeController.unlike);

// List Likes for a Post or Comment
router.get('/posts/:postId/likes', likeController.listLikes);
router.get('/comments/:commentId/likes', likeController.listLikes);

module.exports = router;

