const express = require('express');
const tagController = require('../controllers/tag.controller');
const authMiddleware = require('../middlewares/auth.Middleware');

const router = express.Router();

// Create a Tag
router.post('/tags', authMiddleware, tagController.createTag);

// List all Tags
router.get('/tags', tagController.listTags);

// Update a Tag
router.put('/tags/:tagId', authMiddleware, tagController.updateTag);

// Delete a Tag
router.delete('/tags/:tagId', authMiddleware, tagController.deleteTag);

module.exports = router;



