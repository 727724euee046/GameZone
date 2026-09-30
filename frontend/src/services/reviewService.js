import API from './api';

// -------------------------------------------------------
// reviewService - handles all review-related API calls
// -------------------------------------------------------

// Get all reviews for a specific game
const getReviewsByGame = async (gameId) => {
  const response = await API.get(`/reviews/game/${gameId}`);
  return response.data;
};

// Submit a new review for a game
const createReview = async (gameId, rating, comment) => {
  const response = await API.post('/reviews', { gameId, rating, comment });
  return response.data;
};

// Edit an existing review (only the author)
const updateReview = async (reviewId, rating, comment) => {
  const response = await API.put(`/reviews/${reviewId}`, { rating, comment });
  return response.data;
};

// Delete a review (only the author)
const deleteReview = async (reviewId) => {
  const response = await API.delete(`/reviews/${reviewId}`);
  return response.data;
};

const reviewService = { getReviewsByGame, createReview, updateReview, deleteReview };
export default reviewService;
