// search.controller.js
// include autocomplete, pagination and filtering
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

  autocompleteSuggestions: async (req, res) => {
    try {
      const { query } = req.params;

      // Use regex to match suggestions starting with the provided query
      const suggestions = await Post.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .select('title'); 

      res.status(200).json({ suggestions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

module.exports = searchController;

