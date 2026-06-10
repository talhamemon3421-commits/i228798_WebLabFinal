/**
 * Role-Based Authorization Middleware Factory
 * Returns a middleware function that checks if the authenticated user
 * has one of the specified roles.
 *
 * Usage in routes:
 *   authorize('admin')           - Only admins
 *   authorize('librarian', 'admin') - Librarians and admins
 *
 * @param {...string} roles - The roles allowed to access the route
 * @returns {Function} Express middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // Check if user's role is in the allowed roles list
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of the following roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = authorize;
