const express = require('express');
const { getBooks } = require('../controllers/bookController');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/books
 * @desc    Search and browse all books (supports title, author, genre query params)
 * @access  Private (All authenticated users)
 */
router.get('/', auth, getBooks);

module.exports = router;
