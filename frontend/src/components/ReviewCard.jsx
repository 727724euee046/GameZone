import { useState } from 'react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import reviewService from '../services/reviewService';

// -------------------------------------------------------
// ReviewCard component - displays a single review
// Shows Edit/Delete buttons only to the review author
// -------------------------------------------------------
function ReviewCard({ review, currentUser, onReviewChanged }) {
  const [editMode, setEditMode] = useState(false);

  // Check if the logged-in user is the author of this review
  const isAuthor = currentUser && currentUser._id === review.user._id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await reviewService.deleteReview(review._id);
      onReviewChanged(); // refresh list in parent
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  // If in edit mode, show the ReviewForm pre-filled with existing data
  if (editMode) {
    return (
      <ReviewForm
        gameId={review.game}
        existingReview={review}
        onReviewAdded={() => { setEditMode(false); onReviewChanged(); }}
        onCancelEdit={() => setEditMode(false)}
      />
    );
  }

  return (
    <div className="review-card">
      <div className="review-card-header">
        <strong>{review.user?.name || 'Anonymous'}</strong>
        <StarRating value={review.rating} readonly />
        <span className="review-date">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="review-comment">{review.comment}</p>

      {/* Show edit/delete only to the author */}
      {isAuthor && (
        <div className="review-actions">
          <button className="btn btn-sm btn-outline" onClick={() => setEditMode(true)}>
            ✏️ Edit
          </button>
          <button className="btn btn-sm btn-danger" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewCard;
