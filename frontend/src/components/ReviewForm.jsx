import { useState } from 'react';
import StarRating from './StarRating';
import reviewService from '../services/reviewService';

// -------------------------------------------------------
// ReviewForm component
// Props:
//   gameId      - the game being reviewed
//   onReviewAdded - callback to refresh the review list
//   existingReview - if set, we are editing an existing review
//   onCancelEdit   - callback to cancel edit mode
// -------------------------------------------------------
function ReviewForm({ gameId, onReviewAdded, existingReview, onCancelEdit }) {
  // Pre-fill fields if editing an existing review
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 0);
  const [comment, setComment] = useState(existingReview ? existingReview.comment : '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate inputs
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setLoading(true);
    try {
      if (existingReview) {
        // Edit mode - update existing review
        await reviewService.updateReview(existingReview._id, rating, comment);
      } else {
        // Create mode - submit a new review
        await reviewService.createReview(gameId, rating, comment);
      }
      // Reset form fields
      setRating(0);
      setComment('');
      onReviewAdded(); // tell the parent to refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>{existingReview ? 'Edit Your Review' : 'Write a Review'}</h3>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label>Your Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="form-group">
        <label>Your Comment</label>
        <textarea
          className="form-input"
          rows="3"
          placeholder="Share your thoughts about this game..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <div className="review-form-actions">
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
        {existingReview && (
          <button className="btn btn-outline" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
