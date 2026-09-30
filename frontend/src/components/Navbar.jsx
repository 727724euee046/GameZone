import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// -------------------------------------------------------
// Navbar component - shown on every page
// Receives the current user and a setter to update it
// -------------------------------------------------------
function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();  // clears localStorage
    setUser(null);         // update state in App.jsx
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Logo / Brand */}
      <Link to="/" className="navbar-brand">
        🎮 GameZone
      </Link>

      {/* Navigation links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/games">Games</Link></li>

        {/* Show Favorites and Logout only when user is logged in */}
        {user ? (
          <>
            <li><Link to="/favorites">Favorites</Link></li>

            {/* Show Admin Dashboard link only for admin users */}
            {user.role === 'admin' && (
              <li><Link to="/admin">Admin</Link></li>
            )}

            <li>
              <span className="navbar-username">👤 {user.name}</span>
            </li>
            <li>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register" className="btn btn-primary">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
