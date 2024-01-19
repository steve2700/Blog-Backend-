const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bookmark',
    },
  ],
  imageUrl: {
    type: String,
    validate: {
      validator: function (value) {
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        return urlRegex.test(value);
      },
      message: 'Invalid image URL format',
    },
  },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

