// -------------------------------------------------------
// adminOnly middleware - checks if the logged-in user is an admin
// This middleware must be used AFTER the protect middleware
// because it relies on req.user being set
// -------------------------------------------------------
const adminOnly = (req, res, next) => {
  // req.user is set by the protect middleware
  if (req.user && req.user.role === 'admin') {
    next(); // user is admin, allow the request
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { adminOnly };
