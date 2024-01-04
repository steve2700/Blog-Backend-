const Tag = require('../models/tag.model');
const authMiddleware = require('../middlewares/auth.Middleware');

const tagController = {
  // Create Tag
  createTag: [authMiddleware, async (req, res) => {
    try {
      const { name } = req.body;

      // Check if the tag name is unique
      const existingTag = await Tag.findOne({ name });
      if (existingTag) {
        return res.status(400).json({ message: 'Tag already exists.' });
      }

      // Create a new tag
      const newTag = new Tag({ name });
      await newTag.save();

      res.status(201).json({ tag: newTag });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // List Tags
  listTags: async (req, res) => {
    try {
      // Retrieve all tags
      const tags = await Tag.find();

      res.status(200).json({ tags });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Tag
  updateTag: [authMiddleware, async (req, res) => {
    try {
      const { tagId } = req.params;
      const { name } = req.body;

      // Check if the tag exists
      const tag = await Tag.findById(tagId);
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found.' });
      }

      // Check if the user has permission to update the tag
      // (Add your custom logic for permission checks here if needed)

      // Update the tag name
      tag.name = name;
      await tag.save();

      res.status(200).json({ tag });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Delete Tag
  deleteTag: [authMiddleware, async (req, res) => {
    try {
      const { tagId } = req.params;

      // Check if the tag exists
      const tag = await Tag.findById(tagId);
      if (!tag) {
        return res.status(404).json({ message: 'Tag not found.' });
      }

      // Check if the user has permission to delete the tag
      // (Add your custom logic for permission checks here if needed)

      // Delete the tag
      await tag.remove();

      res.status(200).json({ message: 'Tag deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],
};

module.exports = tagController;

