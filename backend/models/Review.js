const mongoose = require('mongoose');

// Review Schema - stores user reviews for games
const reviewSchema = new mongoose.Schema(
  {
    // Reference to the user who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Reference to the game being reviewed
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
      required: true,
    },
    // Rating between 1 and 5
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt will show when the review was written
  }
);

// A user can only write one review per game
reviewSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
