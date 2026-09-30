// Load environment variables from .env file first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import all route files
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// -------------------------------------------------------
// Middleware setup
// -------------------------------------------------------

// Allow requests from the React frontend (CORS)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// -------------------------------------------------------
// Connect to MongoDB using Mongoose
// -------------------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// -------------------------------------------------------
// API Routes
// All routes are prefixed with /api
// -------------------------------------------------------
app.use('/api/auth', authRoutes);       // /api/auth/register, /api/auth/login
app.use('/api/games', gameRoutes);      // /api/games, /api/games/:id
app.use('/api/reviews', reviewRoutes);  // /api/reviews/game/:gameId
app.use('/api/users', userRoutes);      // /api/users/favorites

// Simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.json({ message: 'GameZone API is running!' });
});

// -------------------------------------------------------
// Global error handler - catches any unhandled errors
// -------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// -------------------------------------------------------
// Start the server
// -------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
