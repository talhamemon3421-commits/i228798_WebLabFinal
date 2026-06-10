const express = require('express');
const { body } = require('express-validator');
const { getAllMembers, updateMemberStatus } = require('../controllers/memberController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @route   GET /api/members
 * @desc    View all members (supports search and isActive query params)
 * @access  Private (Librarian, Admin)
 */
router.get('/', auth, authorize('librarian', 'admin'), getAllMembers);

/**
 * @route   PATCH /api/members/:id/status
 * @desc    Suspend or activate a member
 * @access  Private (Admin only)
 */
router.patch(
  '/:id/status',
  auth,
  authorize('admin'),
  [
    body('isActive')
      .notEmpty()
      .withMessage('isActive field is required')
      .isBoolean()
      .withMessage('isActive must be a boolean value (true or false)'),
    validate,
  ],
  updateMemberStatus
);

module.exports = router;
