const mongoose = require('mongoose');

/**
 * Borrow Schema
 * Represents a borrowing record linking a user (member) to a book.
 * Tracks borrow dates, due dates, return dates, and renewal count.
 */
const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required'],
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['borrowed', 'returned', 'overdue'],
        message: 'Status must be borrowed, returned, or overdue',
      },
      default: 'borrowed',
    },
    renewCount: {
      type: Number,
      default: 0,
      max: [2, 'Maximum 2 renewals allowed'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook to set the default due date.
 * If dueDate is not set, it defaults to 14 days from borrowDate.
 */
borrowSchema.pre('validate', function (next) {
  if (!this.dueDate) {
    const borrow = this.borrowDate || new Date();
    this.dueDate = new Date(borrow.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
  }
  next();
});

// Index for efficient queries on user's borrow history and overdue lookups
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ status: 1, dueDate: 1 });

module.exports = mongoose.model('Borrow', borrowSchema);
