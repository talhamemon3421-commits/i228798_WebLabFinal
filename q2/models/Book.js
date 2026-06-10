const mongoose = require('mongoose');

/**
 * Book Schema
 * Represents a book in the library catalog.
 * Tracks total copies and available copies for borrowing management.
 */
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
      default: 'General',
    },
    publishedYear: {
      type: Number,
      min: [1000, 'Published year must be a valid year'],
      max: [new Date().getFullYear(), 'Published year cannot be in the future'],
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [1, 'Total copies must be at least 1'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      min: [0, 'Available copies cannot be negative'],
      default: 1,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for searching books by title and author
bookSchema.index({ title: 'text', author: 'text' });

module.exports = mongoose.model('Book', bookSchema);
