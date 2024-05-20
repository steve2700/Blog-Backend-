const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const draftSchema = new Schema({
  title: String,
  content: String,
  // Add any other fields you need for your drafts
});

const Draft = mongoose.model('Draft', draftSchema);

module.exports = Draft;

