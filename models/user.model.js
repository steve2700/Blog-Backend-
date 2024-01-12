const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profile: {
    type: String,
    default: 'No profile information available.',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  resetToken: String,
  resetTokenExpiration: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
  try {
    // Hash password only if it's being modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to update the password
userSchema.methods.updatePassword = async function (newPassword) {
  this.password = await bcrypt.hash(newPassword, 10);
  await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;

