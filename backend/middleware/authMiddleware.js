const jwt = require('jsonwebtoken');
const User = require('../models/User');

// -------------------------------------------------------
// protect middleware - checks if the user is logged in
// It reads the JWT token from the Authorization header,
// verifies it, and attaches the user to req.user
// -------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  // JWT is sent as: Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header (split removes "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the secret key from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the decoded token's id
      // .select('-password') means: get user data but exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next(); // move to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
