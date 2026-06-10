const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies the JWT token from the Authorization header.
 * Attaches the authenticated user object to req.user.
 * Also checks if the user account is active (not suspended).
 *
 * Expected header format: Authorization: Bearer <token>
 */
const auth = async (req, res, next) => {
  try {
    // 1. Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    // 2. Extract and verify token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find the user and verify they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid. User no longer exists.',
      });
    }

    // 4. Check if the user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Contact an administrator.',
      });
    }

    // 5. Attach user to request object for downstream use
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid.',
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

module.exports = auth;
