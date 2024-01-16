const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Create Category
router.post('/create', categoryController.createCategory);

// List Categories
router.get('/list', categoryController.listCategories);

// Update Category
router.put('/:categoryId/update', categoryController.updateCategory);

// Delete Category
router.delete('/:categoryId/delete', categoryController.deleteCategory);

module.exports = router;

