const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;

