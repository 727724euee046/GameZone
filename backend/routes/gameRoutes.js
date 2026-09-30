const express = require('express');
const router = express.Router();
const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require('../controllers/gameController');
const { addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// GET /api/games         - get all games (public, supports ?search= and ?genre=)
// POST /api/games        - add a new game (admin only)
router.route('/')
  .get(getGames)
  .post(protect, adminOnly, createGame);

// GET /api/games/:id     - get a single game (public)
// PUT /api/games/:id     - update a game (admin only)
// DELETE /api/games/:id  - delete a game (admin only)
router.route('/:id')
  .get(getGameById)
  .put(protect, adminOnly, updateGame)
  .delete(protect, adminOnly, deleteGame);

// POST   /api/games/:id/favorite - add game to favorites (logged-in users)
// DELETE /api/games/:id/favorite - remove game from favorites (logged-in users)
router.route('/:id/favorite')
  .post(protect, addFavorite)
  .delete(protect, removeFavorite);

module.exports = router;
