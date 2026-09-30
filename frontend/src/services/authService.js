import API from './api';

// -------------------------------------------------------
// authService - handles all authentication API calls
// -------------------------------------------------------

// Register a new user
const register = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  return response.data;
};

// Login and save token + user info to localStorage
const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });

  // Save the token and user data so they persist after page refresh
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));

  return response.data;
};

// Logout - clear everything from localStorage
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get the current user from localStorage (no API call needed)
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

const authService = { register, login, logout, getCurrentUser };
export default authService;
