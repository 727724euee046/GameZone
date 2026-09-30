const mongoose = require('mongoose');

// Game Schema - stores all games in the platform
const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Game name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: ['Action', 'Adventure', 'Racing', 'Sports', 'RPG', 'Strategy'],
    },
    platform: {
      type: String,
      required: [true, 'Platform is required'],
    },
    releaseYear: {
      type: Number,
      required: [true, 'Release year is required'],
    },
    developer: {
      type: String,
      required: [true, 'Developer is required'],
    },
    // image is a URL to the game cover image
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x200?text=No+Image',
    },
    // rating is calculated as average of all reviews
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Game', gameSchema);
