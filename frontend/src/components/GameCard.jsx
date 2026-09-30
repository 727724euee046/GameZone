import { Link } from 'react-router-dom';

// -------------------------------------------------------
// GameCard component - displays a single game as a card
// Used on the Home page and Games page
// -------------------------------------------------------
function GameCard({ game }) {
  return (
    <div className="game-card">
      {/* Game cover image */}
      <img
        src={game.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={game.name}
        className="game-card-image"
      />

      <div className="game-card-body">
        <h3 className="game-card-title">{game.name}</h3>

        <div className="game-card-info">
          <span className="badge">{game.genre}</span>
          <span className="badge badge-platform">{game.platform}</span>
        </div>

        <div className="game-card-meta">
          <span>📅 {game.releaseYear}</span>
          <span>⭐ {Number(game.rating).toFixed(1)}</span>
        </div>

        {/* Link to the Game Details page */}
        <Link to={`/games/${game._id}`} className="btn btn-primary btn-block">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default GameCard;
