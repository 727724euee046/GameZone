const User = require('../models/User');
const Game = require('../models/Game');

// -------------------------------------------------------
// @route   POST /api/games/:id/favorite
// @desc    Add a game to the user's favorites list
// @access  Private
// -------------------------------------------------------
const addFavorite = async (req, res) => {
  try {
    const gameId = req.params.id;

    // Check if the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if the game is already in favorites
    if (user.favorites.includes(gameId)) {
      return res.status(400).json({ message: 'Game is already in your favorites' });
    }

    // Add the game id to favorites array
    user.favorites.push(gameId);
    await user.save();

    res.json({ message: 'Game added to favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites' });
  }
};

// -------------------------------------------------------
// @route   DELETE /api/games/:id/favorite
// @desc    Remove a game from the user's favorites list
// @access  Private
// -------------------------------------------------------
const removeFavorite = async (req, res) => {
  try {
    const gameId = req.params.id;

    const user = await User.findById(req.user._id);

    // Filter out the game id from favorites
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== gameId
    );
    await user.save();

    res.json({ message: 'Game removed from favorites', favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from favorites' });
  }
};

// -------------------------------------------------------
// @route   GET /api/users/favorites
// @desc    Get all favorite games for the logged-in user
// @access  Private
// -------------------------------------------------------
const getFavorites = async (req, res) => {
  try {
    // populate('favorites') replaces each ObjectId in favorites[] with the full Game document
    const user = await User.findById(req.user._id).populate('favorites');

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

module.exports = { addFavorite, removeFavorite, getFavorites };
