import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';

const GENRES = ['Action', 'Adventure', 'Racing', 'Sports', 'RPG', 'Strategy'];

// Empty form state - used for both "add" and "edit" modes
const emptyForm = {
  name: '', description: '', genre: 'Action',
  platform: '', releaseYear: '', developer: '', image: '',
};

// -------------------------------------------------------
// AdminDashboard page - only accessible to admin users
// Allows adding, editing, and deleting games (full CRUD)
// -------------------------------------------------------
function AdminDashboard({ user }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null); // null = add mode, id = edit mode
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Redirect non-admin users away
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load all games
  const fetchGames = async () => {
    try {
      const data = await gameService.getGames();
      setGames(data);
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // Handle input changes for any form field
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form - either add or edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.name || !formData.description || !formData.platform ||
        !formData.releaseYear || !formData.developer) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        // Update existing game
        await gameService.updateGame(editingId, formData);
        setSuccess('Game updated successfully!');
      } else {
        // Create new game
        await gameService.createGame(formData);
        setSuccess('Game added successfully!');
      }
      setFormData(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchGames(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save game');
    }
  };

  // Populate form with existing game data for editing
  const handleEdit = (game) => {
    setFormData({
      name: game.name,
      description: game.description,
      genre: game.genre,
      platform: game.platform,
      releaseYear: game.releaseYear,
      developer: game.developer,
      image: game.image || '',
    });
    setEditingId(game._id);
    setShowForm(true);
    setError('');
    setSuccess('');
    window.scrollTo(0, 0);
  };

  // Delete a game
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    try {
      await gameService.deleteGame(id);
      setSuccess('Game deleted.');
      fetchGames();
    } catch (err) {
      setError('Failed to delete game');
    }
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="section">
      <div className="admin-header">
        <h2 className="section-title">🛠️ Admin Dashboard</h2>
        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add New Game
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {/* ---- Add / Edit Form ---- */}
      {showForm && (
        <div className="admin-form-card">
          <h3>{editingId ? 'Edit Game' : 'Add New Game'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Game Name *</label>
                <input name="name" className="form-input" value={formData.name}
                  onChange={handleChange} placeholder="e.g. FIFA 24" />
              </div>
              <div className="form-group">
                <label className="form-label">Platform *</label>
                <input name="platform" className="form-input" value={formData.platform}
                  onChange={handleChange} placeholder="e.g. PC, PS5, Xbox" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Genre *</label>
                <select name="genre" className="form-input" value={formData.genre}
                  onChange={handleChange}>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Release Year *</label>
                <input name="releaseYear" type="number" className="form-input"
                  value={formData.releaseYear} onChange={handleChange} placeholder="e.g. 2024" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Developer *</label>
              <input name="developer" className="form-input" value={formData.developer}
                onChange={handleChange} placeholder="e.g. Rockstar Games" />
            </div>

            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input name="image" className="form-input" value={formData.image}
                onChange={handleChange} placeholder="https://..." />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-input" rows="3"
                value={formData.description} onChange={handleChange}
                placeholder="Write a short description of the game..." />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit">
                {editingId ? 'Update Game' : 'Add Game'}
              </button>
              <button className="btn btn-outline" type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ---- Games Table ---- */}
      <h3 className="sub-title">All Games ({games.length})</h3>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : games.length === 0 ? (
        <p className="loading-text">No games yet. Add the first one!</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Genre</th>
                <th>Platform</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game._id}>
                  <td>{game.name}</td>
                  <td><span className="badge">{game.genre}</span></td>
                  <td>{game.platform}</td>
                  <td>{game.releaseYear}</td>
                  <td>⭐ {Number(game.rating).toFixed(1)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => handleEdit(game)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(game._id)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
