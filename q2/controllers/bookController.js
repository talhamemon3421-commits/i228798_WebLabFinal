const Book = require('../models/Book');

/**
 * @desc    Search and browse all books with optional filters
 * @route   GET /api/books
 * @access  Private (All authenticated users)
 * @query   title, author, genre, page, limit
 */
const getBooks = async (req, res, next) => {
  try {
    const { title, author, genre, page = 1, limit = 10 } = req.query;

    // Build filter object dynamically based on provided query params
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .populate('addedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
};
