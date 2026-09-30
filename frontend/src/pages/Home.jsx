import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import gameService from '../services/gameService';

// -------------------------------------------------------
// Home page - landing page of GameZone
// Shows a hero section and a few popular games below it
// -------------------------------------------------------
function Home() {
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all games and show the top 6 by rating
    const fetchGames = async () => {
      try {
        const games = await gameService.getGames();
        // Sort by rating descending and take first 6
        const top6 = [...games].sort((a, b) => b.rating - a.rating).slice(0, 6);
        setPopularGames(top6);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  return (
    <div>
      {/* ---- Hero Section ---- */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to <span className="text-red">GameZone</span></h1>
          <p className="hero-subtitle">
            Discover, review and save your favorite games.
          </p>
          <Link to="/games" className="btn btn-primary btn-lg">
            🎮 Explore Games
          </Link>
        </div>
      </section>

      {/* ---- Popular Games Section ---- */}
      <section className="section">
        <h2 className="section-title">🔥 Popular Games</h2>

        {loading ? (
          <p className="loading-text">Loading games...</p>
        ) : popularGames.length === 0 ? (
          <p className="loading-text">No games added yet. Check back soon!</p>
        ) : (
          <div className="games-grid">
            {popularGames.map((game) => (
              <GameCard key={game._id} game={game} />
            ))}
          </div>
        )}

        <div className="center-btn">
          <Link to="/games" className="btn btn-outline">
            View All Games →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
