const express = require('express');
const ratingController = require('../controllers/rating.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Rate a Post
router.post('/ratePost', authMiddleware, ratingController.ratePost);

// List Ratings for a Post
router.get('/listRatings/:postId', ratingController.listRatings);

module.exports = router;


