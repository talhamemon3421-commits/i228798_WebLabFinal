const express = require('express');
const { body } = require('express-validator');
const { addBook, updateBook, deleteBook } = require('../controllers/catalogController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   POST /api/catalog
 * @desc    Add a new book to the catalog
 * @access  Private (Librarian, Admin)
 */
router.post(
  '/',
  auth,
  authorize('librarian', 'admin'),
  [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Book title is required')
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('author')
      .trim()
      .notEmpty()
      .withMessage('Author name is required')
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    body('isbn')
      .trim()
      .notEmpty()
      .withMessage('ISBN is required'),
    body('genre')
      .optional()
      .trim(),
    body('publishedYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage(`Published year must be between 1000 and ${new Date().getFullYear()}`),
    body('totalCopies')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Total copies must be at least 1'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    validate,
  ],
  addBook
);

/**
 * @route   PATCH /api/catalog/:id
 * @desc    Update book details
 * @access  Private (Librarian, Admin)
 */
router.patch(
  '/:id',
  auth,
  authorize('librarian', 'admin'),
  [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Title cannot exceed 200 characters'),
    body('author')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Author name cannot exceed 100 characters'),
    body('isbn')
      .optional()
      .trim(),
    body('publishedYear')
      .optional()
      .isInt({ min: 1000, max: new Date().getFullYear() })
      .withMessage(`Published year must be between 1000 and ${new Date().getFullYear()}`),
    body('totalCopies')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Total copies must be at least 1'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description cannot exceed 1000 characters'),
    validate,
  ],
  updateBook
);

/**
 * @route   DELETE /api/catalog/:id
 * @desc    Delete a book from the catalog
 * @access  Private (Admin only)
 */
router.delete('/:id', auth, authorize('admin'), deleteBook);

module.exports = router;
