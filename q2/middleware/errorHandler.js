/**
 * Global Error Handler Middleware
 * Catches all unhandled errors and returns a consistent JSON response.
 * Handles specific Mongoose and MongoDB errors with meaningful messages.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (only stack trace in development)
  console.error('Error:', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose Validation Error (e.g., required fields, enum mismatch)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose Cast Error (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // MongoDB Duplicate Key Error (e.g., duplicate email or ISBN)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field '${field}'. This ${field} already exists.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
  });
};

module.exports = errorHandler;
