const express = require('express');
const { body, param } = require('express-validator');
const {
  borrowBook,
  getBorrowHistory,
  returnBook,
  renewBorrow,
  getOverdueBorrows,
} = require('../controllers/borrowController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/borrow/overdue
 * @desc    Get all overdue borrowings
 * @access  Private (Librarian, Admin)
 * NOTE: This route MUST be defined before /:id routes to avoid conflicts.
 */
router.get('/overdue', auth, authorize('librarian', 'admin'), getOverdueBorrows);

/**
 * @route   POST /api/borrow
 * @desc    Borrow a book
 * @access  Private (Member only)
 */
router.post(
  '/',
  auth,
  authorize('member'),
  [
    body('bookId')
      .notEmpty()
      .withMessage('Book ID is required')
      .isMongoId()
      .withMessage('Invalid Book ID format'),
    validate,
  ],
  borrowBook
);

/**
 * @route   GET /api/borrow
 * @desc    Get own borrow history
 * @access  Private (Member only)
 */
router.get('/', auth, authorize('member'), getBorrowHistory);

/**
 * @route   PATCH /api/borrow/:id/return
 * @desc    Return a borrowed book
 * @access  Private (Member only)
 */
router.patch(
  '/:id/return',
  auth,
  authorize('member'),
  [param('id').isMongoId().withMessage('Invalid Borrow ID format'), validate],
  returnBook
);

/**
 * @route   PATCH /api/borrow/:id/renew
 * @desc    Renew a borrowing period
 * @access  Private (Member only)
 */
router.patch(
  '/:id/renew',
  auth,
  authorize('member'),
  [param('id').isMongoId().withMessage('Invalid Borrow ID format'), validate],
  renewBorrow
);

module.exports = router;
