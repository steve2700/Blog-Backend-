// Assuming you have a router set up with Express
const express = require('express');
const router = express.Router();

const Draft = require('../models/draft'); // Import your Draft model

// GET /api/drafts - Fetch all drafts
router.get('/drafts', async (req, res) => {
  try {
    const drafts = await Draft.find();
    res.json({ drafts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

