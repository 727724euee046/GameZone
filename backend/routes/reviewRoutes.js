const express = require('express');
const router = express.Router();
const {
  getReviewsByGame,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/reviews/game/:gameId - get all reviews for a game (public)
router.get('/game/:gameId', getReviewsByGame);

// POST /api/reviews - create a new review (logged-in users only)
router.post('/', protect, createReview);

// PUT /api/reviews/:id    - edit a review (only the review author)
// DELETE /api/reviews/:id - delete a review (only the review author)
router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
