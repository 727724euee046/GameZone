const mongoose = require('mongoose');

// User Schema - stores all registered users
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    // role can be 'user' or 'admin'
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // favorites is an array of Game ObjectIds
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
      },
    ],
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('User', userSchema);
