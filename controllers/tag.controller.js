const Tag = require('../models/tag.model');
const authMiddleware = require('../middlewares/auth.Middleware');

const tagController = {
  // Create Tag
  createTag: [authMiddleware, async (req, res) => {
    try {
      const { name } = req.body;

      // Use findOneAndUpdate with upsert to handle uniqueness
      const newTag = await Tag.findOneAndUpdate(
        { name },
        { $setOnInsert: { name } },
        { upsert: true, new: true, runValidators: true }
      );

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

      // Use findOneAndUpdate for atomic updates
      const updatedTag = await Tag.findOneAndUpdate(
        { _id: tagId },
        { $set: { name } },
        { new: true, runValidators: true }
      );

      if (!updatedTag) {
        return res.status(404).json({ message: 'Tag not found.' });
      }

      res.status(200).json({ tag: updatedTag });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],

  // Delete Tag
  deleteTag: [authMiddleware, async (req, res) => {
    try {
      const { tagId } = req.params;

      // Use findOneAndDelete for atomic deletion
      const deletedTag = await Tag.findOneAndDelete({ _id: tagId });

      if (!deletedTag) {
        return res.status(404).json({ message: 'Tag not found.' });
      }

      res.status(200).json({ message: 'Tag deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }],
};

module.exports = tagController;

