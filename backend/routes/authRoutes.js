const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register - create a new account
router.post('/register', registerUser);

// POST /api/auth/login - login and receive a JWT token
router.post('/login', loginUser);

// GET /api/auth/me - get the current logged-in user (protected)
router.get('/me', protect, getMe);

module.exports = router;
