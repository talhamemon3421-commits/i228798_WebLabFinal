const { validationResult } = require('express-validator');

/**
 * Validation Middleware
 * Checks the results of express-validator validation chains.
 * If validation errors exist, returns a 400 response with detailed error messages.
 * Otherwise, passes control to the next middleware/controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format errors into a clean array of messages
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: formattedErrors,
    });
  }

  next();
};

module.exports = validate;
