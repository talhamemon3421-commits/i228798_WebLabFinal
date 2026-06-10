const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new member account
 * @access  Public
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login a user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    validate,
  ],
  login
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get authenticated user's profile
 * @access  Private (All authenticated users)
 */
router.get('/profile', auth, getProfile);

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update authenticated user's profile
 * @access  Private (All authenticated users)
 */
router.patch(
  '/profile',
  auth,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    validate,
  ],
  updateProfile
);

module.exports = router;
