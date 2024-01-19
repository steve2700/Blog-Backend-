const express = require('express');
const bookmarkController = require('../controllers/bookmark.controller');
const authMiddleware = require('../middlewares/auth.Middleware'); // Corrected import

const router = express.Router();

// Bookmark a Post
router.post('/posts/:postId/bookmark', authMiddleware, bookmarkController.bookmarkPost);

// Unbookmark a Post
router.delete('/posts/:postId/unbookmark', authMiddleware, bookmarkController.unbookmarkPost);

// List Bookmarks for a User
router.get('/bookmarks', authMiddleware, bookmarkController.listBookmarks);

module.exports = router;

