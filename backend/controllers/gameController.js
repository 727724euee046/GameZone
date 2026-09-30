const Game = require('../models/Game');

// -------------------------------------------------------
// @route   GET /api/games
// @desc    Get all games (with optional search and genre filter)
// @access  Public
// -------------------------------------------------------
const getGames = async (req, res) => {
  try {
    const { search, genre } = req.query;

    // Build a filter object based on query parameters
    let filter = {};

    if (genre) {
      filter.genre = genre;
    }

    if (search) {
      // Use regex for case-insensitive search on the game name
      filter.name = { $regex: search, $options: 'i' };
    }

    const games = await Game.find(filter).sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games' });
  }
};

// -------------------------------------------------------
// @route   GET /api/games/:id
// @desc    Get a single game by ID
// @access  Public
// -------------------------------------------------------
const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching game' });
  }
};

// -------------------------------------------------------
// @route   POST /api/games
// @desc    Add a new game (Admin only)
// @access  Private/Admin
// -------------------------------------------------------
const createGame = async (req, res) => {
  const { name, description, genre, platform, releaseYear, developer, image } = req.body;

  // Validate required fields
  if (!name || !description || !genre || !platform || !releaseYear || !developer) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  try {
    const game = await Game.create({
      name,
      description,
      genre,
      platform,
      releaseYear,
      developer,
      image,
    });

    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: 'Error creating game' });
  }
};

// -------------------------------------------------------
// @route   PUT /api/games/:id
// @desc    Update a game (Admin only)
// @access  Private/Admin
// -------------------------------------------------------
const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Update only the fields that were provided
    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new:true returns the updated document
    );

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: 'Error updating game' });
  }
};

// -------------------------------------------------------
// @route   DELETE /api/games/:id
// @desc    Delete a game (Admin only)
// @access  Private/Admin
// -------------------------------------------------------
const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    await game.deleteOne();
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting game' });
  }
};

module.exports = { getGames, getGameById, createGame, updateGame, deleteGame };
