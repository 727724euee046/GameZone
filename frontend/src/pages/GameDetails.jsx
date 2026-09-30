import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import gameService from '../services/gameService';
import reviewService from '../services/reviewService';

// -------------------------------------------------------
// GameDetails page - shows full info for one game
// Also lists reviews and lets logged-in users add a review
// -------------------------------------------------------
function GameDetails({ user }) {
  const { id } = useParams(); // get game id from URL
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [favMessage, setFavMessage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  // Check if this game is already in the user's favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      try {
        const favs = await gameService.getFavorites();
        setIsFavorited(favs.some((g) => g._id === id));
      } catch (err) {
        // silently ignore if user not logged in
      }
    };
    checkFavorite();
  }, [id, user]);

  // Fetch game details
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await gameService.getGameById(id);
        setGame(data);
      } catch (err) {
        console.error('Failed to load game:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [id]);

  // Fetch reviews for this game
  const fetchReviews = async () => {
    try {
      const data = await reviewService.getReviewsByGame(id);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Handle Add / Remove Favorite
  const handleFavorite = async () => {
    if (!user) {
      setFavMessage('Please login to add favorites');
      return;
    }
    setFavLoading(true);
    try {
      if (isFavorited) {
        await gameService.removeFromFavorites(id);
        setIsFavorited(false);
        setFavMessage('Removed from favorites');
      } else {
        await gameService.addToFavorites(id);
        setIsFavorited(true);
        setFavMessage('Added to favorites!');
      }
    } catch (err) {
      setFavMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setFavLoading(false);
      // Clear message after 3 seconds
      setTimeout(() => setFavMessage(''), 3000);
    }
  };

  // Check if current user already submitted a review
  const userAlreadyReviewed = user && reviews.some((r) => r.user?._id === user._id);

  if (loading) return <p className="loading-text">Loading game details...</p>;
  if (!game) return <p className="loading-text">Game not found.</p>;

  return (
    <div className="section">
      {/* ---- Game Details Card ---- */}
      <div className="game-details-card">
        <img
          src={game.image || 'https://via.placeholder.com/600x350?text=No+Image'}
          alt={game.name}
          className="game-details-image"
        />

        <div className="game-details-info">
          <h1 className="game-details-title">{game.name}</h1>

          <div className="game-details-meta">
            <span className="badge">{game.genre}</span>
            <span className="badge badge-platform">{game.platform}</span>
            <span>📅 {game.releaseYear}</span>
            <span>👨‍💻 {game.developer}</span>
          </div>

          <div className="game-details-rating">
            <StarRating value={Math.round(game.rating)} readonly />
            <span>{Number(game.rating).toFixed(1)} / 5</span>
          </div>

          <p className="game-details-description">{game.description}</p>

          {/* Favorite button */}
          <button
            className={`btn ${isFavorited ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleFavorite}
            disabled={favLoading}
          >
            {favLoading ? '...' : isFavorited ? '💔 Remove from Favorites' : '❤️ Add to Favorites'}
          </button>

          {favMessage && <p className="fav-message">{favMessage}</p>}
        </div>
      </div>

      {/* ---- Reviews Section ---- */}
      <div className="reviews-section">
        <h2 className="section-title">💬 Reviews ({reviews.length})</h2>

        {/* Show review form only to logged-in users who haven't reviewed yet */}
        {user && !userAlreadyReviewed && (
          <ReviewForm gameId={id} onReviewAdded={fetchReviews} />
        )}

        {!user && (
          <p className="loading-text">Please <a href="/login">login</a> to write a review.</p>
        )}

        {reviews.length === 0 ? (
          <p className="loading-text">No reviews yet. Be the first!</p>
        ) : (
          <div>
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                currentUser={user}
                onReviewChanged={fetchReviews}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GameDetails;
