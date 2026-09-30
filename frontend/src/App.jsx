import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Games from './pages/Games';
import GameDetails from './pages/GameDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import AdminDashboard from './pages/AdminDashboard';
import authService from './services/authService';

// -------------------------------------------------------
// App.jsx - the root component of the React application
// - Holds the global "user" state (logged-in user info)
// - Sets up React Router so each URL renders the right page
// - Renders the Navbar on every page
// -------------------------------------------------------
function App() {
  // Initialize user from localStorage so login persists after page refresh
  const [user, setUser] = useState(authService.getCurrentUser());

  return (
    <div className="app">
      {/* Navbar is shown on every page; receives user + setUser for logout */}
      <Navbar user={user} setUser={setUser} />

      {/* Main content area */}
      <main className="main-content">
        <Routes>
          {/* Public routes - anyone can visit */}
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetails user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          {/* Protected routes - pass user so the page can decide to redirect */}
          <Route path="/favorites" element={<Favorites user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />

          {/* Fallback - redirect unknown URLs to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>🎮 GameZone &copy; {new Date().getFullYear()} — Built with MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
