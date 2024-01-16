const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
}, { timestamps: true });
// Define a custom method to delete a category
categorySchema.methods.deleteCategory = async function () {
  return this.deleteOne();
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

