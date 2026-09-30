import API from './api';

// -------------------------------------------------------
// gameService - handles all game-related API calls
// -------------------------------------------------------

// Get all games, optionally filtered by search term and genre
const getGames = async (search = '', genre = '') => {
  const params = {};
  if (search) params.search = search;
  if (genre) params.genre = genre;

  const response = await API.get('/games', { params });
  return response.data;
};

// Get a single game by its ID
const getGameById = async (id) => {
  const response = await API.get(`/games/${id}`);
  return response.data;
};

// Create a new game (admin only)
const createGame = async (gameData) => {
  const response = await API.post('/games', gameData);
  return response.data;
};

// Update a game by ID (admin only)
const updateGame = async (id, gameData) => {
  const response = await API.put(`/games/${id}`, gameData);
  return response.data;
};

// Delete a game by ID (admin only)
const deleteGame = async (id) => {
  const response = await API.delete(`/games/${id}`);
  return response.data;
};

// Add a game to the logged-in user's favorites
const addToFavorites = async (id) => {
  const response = await API.post(`/games/${id}/favorite`);
  return response.data;
};

// Remove a game from the logged-in user's favorites
const removeFromFavorites = async (id) => {
  const response = await API.delete(`/games/${id}/favorite`);
  return response.data;
};

// Get all favorites for the logged-in user
const getFavorites = async () => {
  const response = await API.get('/users/favorites');
  return response.data;
};

const gameService = {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  addToFavorites,
  removeFromFavorites,
  getFavorites,
};
export default gameService;
