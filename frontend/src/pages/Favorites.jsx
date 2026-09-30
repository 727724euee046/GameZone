import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import gameService from '../services/gameService';

// -------------------------------------------------------
// Favorites page - shows all games the user has favorited
// Only accessible to logged-in users
// -------------------------------------------------------
function Favorites({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await gameService.getFavorites();
        setFavorites(data);
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  // If user is not logged in, show a message
  if (!user) {
    return (
      <div className="section center-text">
        <h2>Please login to view your favorites</h2>
        <Link to="/login" className="btn btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="section">
      <h2 className="section-title">❤️ My Favorites</h2>

      {loading ? (
        <p className="loading-text">Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <div className="center-text">
          <p className="loading-text">You have no favorite games yet.</p>
          <Link to="/games" className="btn btn-primary">
            Browse Games
          </Link>
        </div>
      ) : (
        <div className="games-grid">
          {favorites.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
