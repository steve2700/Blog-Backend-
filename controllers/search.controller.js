// search.controller.js
// users can now search freely

const Post = require('../models/post.model');

const searchController = {
  searchPosts: async (req, res) => {
    try {
      const { query, author, category, tag, sortBy, sortOrder } = req.query;

      const searchQuery = {
        $text: { $search: query },
        // Added more conditions for other fields like author, category, tag
        // Example: author: author, category: category, tag: tag
      };

      let sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
      }

      const results = await Post.find(searchQuery)
        .sort(sortOptions);

      res.status(200).json({ results });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};


module.exports = searchController;

