const Category = require('../models/category.model');
const authMiddleware = require('../middlewares/auth.Middleware');

const categoryController = {
  // Create Category
  createCategory: [authMiddleware, async (req, res) => {
    try {
      const { name } = req.body;

      // Check if the category name is unique
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists.' });
      }

      // Create a new category
      const newCategory = new Category({ name });
      await newCategory.save();

      res.status(201).json({ category: newCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Categories
  listCategories: async (req, res) => {
    try {
      // Retrieve all categories
      const categories = await Category.find();

      res.status(200).json({ categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Category
  updateCategory: [authMiddleware, async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      // Check if the user has permission to update the category
      // (Add your custom logic for permission checks here if needed)

      // Update the category name
      category.name = name;
      await category.save();

      res.status(200).json({ category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Delete Category
  deleteCategory: [authMiddleware, async (req, res) => {
    try {
      const { categoryId } = req.params;

      // Check if the category exists
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
      }

      // Check if the user has permission to delete the category
      // (Add your custom logic for permission checks here if needed)

      // Delete the category
      await category.remove();

      res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],
};

module.exports = categoryController;

