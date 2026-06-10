const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

/**
 * @desc    Borrow a book
 * @route   POST /api/borrow
 * @access  Private (Member only)
 */
const borrowBook = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // 1. Find the book
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found.',
      });
    }

    // 2. Check if copies are available
    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No copies of this book are currently available.',
      });
    }

    // 3. Check if user already has this book borrowed (and not returned)
    const existingBorrow = await Borrow.findOne({
      user: userId,
      book: bookId,
      status: 'borrowed',
    });
    if (existingBorrow) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book and have not returned it yet.',
      });
    }

    // 4. Create the borrow record (dueDate auto-set by pre-validate hook)
    const borrow = await Borrow.create({
      user: userId,
      book: bookId,
    });

    // 5. Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    // 6. Populate and respond
    const populatedBorrow = await Borrow.findById(borrow._id)
      .populate('book', 'title author isbn')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully.',
      data: { borrow: populatedBorrow },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get authenticated member's borrow history
 * @route   GET /api/borrow
 * @access  Private (Member only)
 */
const getBorrowHistory = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { user: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Borrow.countDocuments(filter);

    const borrows = await Borrow.find(filter)
      .populate('book', 'title author isbn genre')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        borrows,
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

/**
 * @desc    Return a borrowed book
 * @route   PATCH /api/borrow/:id/return
 * @access  Private (Member only)
 */
const returnBook = async (req, res, next) => {
  try {
    const borrowId = req.params.id;
    const userId = req.user._id;

    // 1. Find the borrow record
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found.',
      });
    }

    // 2. Ensure this borrow belongs to the requesting user
    if (borrow.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only return books that you have borrowed.',
      });
    }

    // 3. Check if already returned
    if (borrow.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'This book has already been returned.',
      });
    }

    // 4. Update borrow record
    borrow.status = 'returned';
    borrow.returnDate = new Date();
    await borrow.save();

    // 5. Increment available copies
    await Book.findByIdAndUpdate(borrow.book, {
      $inc: { availableCopies: 1 },
    });

    // 6. Populate and respond
    const updatedBorrow = await Borrow.findById(borrowId)
      .populate('book', 'title author isbn')
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: 'Book returned successfully.',
      data: { borrow: updatedBorrow },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Renew a borrowing period (+14 days, max 2 renewals)
 * @route   PATCH /api/borrow/:id/renew
 * @access  Private (Member only)
 */
const renewBorrow = async (req, res, next) => {
  try {
    const borrowId = req.params.id;
    const userId = req.user._id;

    // 1. Find the borrow record
    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: 'Borrow record not found.',
      });
    }

    // 2. Ensure this borrow belongs to the requesting user
    if (borrow.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only renew your own borrowings.',
      });
    }

    // 3. Check if the book is already returned
    if (borrow.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot renew a book that has already been returned.',
      });
    }

    // 4. Check renewal limit
    if (borrow.renewCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Maximum renewal limit (2) reached. Please return the book.',
      });
    }

    // 5. Extend due date by 14 days and increment renewal count
    borrow.dueDate = new Date(borrow.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    borrow.renewCount += 1;
    borrow.status = 'borrowed'; // Reset status in case it was overdue
    await borrow.save();

    // 6. Populate and respond
    const updatedBorrow = await Borrow.findById(borrowId)
      .populate('book', 'title author isbn')
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      message: `Borrowing renewed successfully. New due date: ${borrow.dueDate.toISOString().split('T')[0]}. Renewals used: ${borrow.renewCount}/2.`,
      data: { borrow: updatedBorrow },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all overdue borrowings
 * @route   GET /api/borrow/overdue
 * @access  Private (Librarian, Admin)
 */
const getOverdueBorrows = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const now = new Date();

    // Find all borrows that are past due and not returned
    const filter = {
      status: { $in: ['borrowed', 'overdue'] },
      dueDate: { $lt: now },
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Borrow.countDocuments(filter);

    // Update status to 'overdue' for any that are still marked 'borrowed'
    await Borrow.updateMany(
      { status: 'borrowed', dueDate: { $lt: now } },
      { $set: { status: 'overdue' } }
    );

    const borrows = await Borrow.find(filter)
      .populate('book', 'title author isbn')
      .populate('user', 'name email')
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        borrows,
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
  borrowBook,
  getBorrowHistory,
  returnBook,
  renewBorrow,
  getOverdueBorrows,
};
