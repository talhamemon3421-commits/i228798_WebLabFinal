const Book = require('../models/Book');
const Borrow = require('../models/Borrow');

/**
 * @desc    Add a new book to the catalog
 * @route   POST /api/catalog
 * @access  Private (Librarian, Admin)
 */
const addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, genre, publishedYear, totalCopies, description } = req.body;

    // Check for duplicate ISBN
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'A book with this ISBN already exists in the catalog.',
      });
    }

    // Create the book with addedBy set to the current user
    const book = await Book.create({
      title,
      author,
      isbn,
      genre,
      publishedYear,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1,
      description,
      addedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Book added to catalog successfully.',
      data: { book },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update book details
 * @route   PATCH /api/catalog/:id
 * @access  Private (Librarian, Admin)
 */
const updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const { title, author, isbn, genre, publishedYear, totalCopies, description } = req.body;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
    }

    // If ISBN is being changed, check for duplicates
    if (isbn && isbn !== book.isbn) {
      const duplicateIsbn = await Book.findOne({ isbn, _id: { $ne: bookId } });
      if (duplicateIsbn) {
        return res.status(400).json({
          success: false,
          message: 'Another book with this ISBN already exists.',
        });
      }
      book.isbn = isbn;
    }

    // Update fields if provided
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (publishedYear) book.publishedYear = publishedYear;
    if (description !== undefined) book.description = description;

    // Handle totalCopies update — adjust availableCopies proportionally
    if (totalCopies !== undefined) {
      const borrowedCopies = book.totalCopies - book.availableCopies;
      if (totalCopies < borrowedCopies) {
        return res.status(400).json({
          success: false,
          message: `Cannot set total copies below ${borrowedCopies}. There are currently ${borrowedCopies} copies borrowed.`,
        });
      }
      book.availableCopies = totalCopies - borrowedCopies;
      book.totalCopies = totalCopies;
    }

    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book updated successfully.',
      data: { book },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a book from the catalog
 * @route   DELETE /api/catalog/:id
 * @access  Private (Admin only)
 */
const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
    }

    // Check if any copies are currently borrowed
    const activeBorrows = await Borrow.countDocuments({
      book: bookId,
      status: 'borrowed',
    });
    if (activeBorrows > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete this book. There are ${activeBorrows} active borrow(s). Wait for all copies to be returned.`,
      });
    }

    await Book.findByIdAndDelete(bookId);

    res.status(200).json({
      success: true,
      message: 'Book deleted from catalog successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBook,
  updateBook,
  deleteBook,
};
