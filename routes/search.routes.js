// search.routes.js
const express = require('express');
const searchController = require('../controllers/search.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Search posts
router.get('/search/posts', authMiddleware, searchController.searchPosts);

// Autocomplete suggestions
router.get('/search/autocomplete/:query', authMiddleware, searchController.autocompleteSuggestions);

module.exports = router;

