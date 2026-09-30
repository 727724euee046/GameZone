const express = require('express');
const router = express.Router();
const { getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/users/favorites - get all favorite games for the logged-in user
router.get('/favorites', protect, getFavorites);

module.exports = router;
