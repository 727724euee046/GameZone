import { useState, useEffect } from 'react';
import GameCard from '../components/GameCard';
import gameService from '../services/gameService';

const GENRES = ['', 'Action', 'Adventure', 'Racing', 'Sports', 'RPG', 'Strategy'];

// -------------------------------------------------------
// Games page - shows all games with search and filter
// -------------------------------------------------------
function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  // Fetch games whenever search or genre changes
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const data = await gameService.getGames(search, genre);
        setGames(data);
      } catch (err) {
        console.error('Failed to fetch games:', err);
      } finally {
        setLoading(false);
      }
    };

    // Small delay so we don't call the API on every single keystroke
    const timer = setTimeout(fetchGames, 400);
    return () => clearTimeout(timer);
  }, [search, genre]);

  return (
    <div className="section">
      <h2 className="section-title">🎮 All Games</h2>

      {/* ---- Search and Filter Bar ---- */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input search-input"
          placeholder="🔍 Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-input genre-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g === '' ? 'All Genres' : g}
            </option>
          ))}
        </select>
      </div>

      {/* ---- Game Cards Grid ---- */}
      {loading ? (
        <p className="loading-text">Loading games...</p>
      ) : games.length === 0 ? (
        <p className="loading-text">No games found. Try a different search.</p>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Games;
