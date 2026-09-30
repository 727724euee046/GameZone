const Review = require('../models/Review');
const Game = require('../models/Game');

// -------------------------------------------------------
// Helper: recalculate and save the average rating for a game
// Called after every review create / update / delete
// -------------------------------------------------------
const updateGameRating = async (gameId) => {
  const reviews = await Review.find({ game: gameId });

  if (reviews.length === 0) {
    await Game.findByIdAndUpdate(gameId, { rating: 0 });
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Game.findByIdAndUpdate(gameId, { rating: avgRating.toFixed(1) });
};

// -------------------------------------------------------
// @route   GET /api/reviews/game/:gameId
// @desc    Get all reviews for a specific game
// @access  Public
// -------------------------------------------------------
const getReviewsByGame = async (req, res) => {
  try {
    // populate('user', 'name') replaces the user ObjectId with the user's name
    const reviews = await Review.find({ game: req.params.gameId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// -------------------------------------------------------
// @route   POST /api/reviews
// @desc    Create a new review for a game
// @access  Private (logged-in users only)
// -------------------------------------------------------
const createReview = async (req, res) => {
  const { gameId, rating, comment } = req.body;

  if (!gameId || !rating || !comment) {
    return res.status(400).json({ message: 'Please provide game, rating, and comment' });
  }

  try {
    // Check if the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Check if this user already reviewed this game
    const alreadyReviewed = await Review.findOne({ user: req.user._id, game: gameId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this game' });
    }

    // Create the review
    const review = await Review.create({
      user: req.user._id,
      game: gameId,
      rating,
      comment,
    });

    // Populate user name before sending response
    await review.populate('user', 'name');

    // Update the game's average rating
    await updateGameRating(gameId);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review' });
  }
};

// -------------------------------------------------------
// @route   PUT /api/reviews/:id
// @desc    Edit a review (only the author can edit)
// @access  Private
// -------------------------------------------------------
const updateReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only the user who wrote the review can edit it
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    await review.populate('user', 'name');

    // Recalculate game rating
    await updateGameRating(review.game);

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
};

// -------------------------------------------------------
// @route   DELETE /api/reviews/:id
// @desc    Delete a review (only the author can delete)
// @access  Private
// -------------------------------------------------------
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only the review author can delete it
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const gameId = review.game;
    await review.deleteOne();

    // Recalculate game rating after deletion
    await updateGameRating(gameId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};

module.exports = { getReviewsByGame, createReview, updateReview, deleteReview };
