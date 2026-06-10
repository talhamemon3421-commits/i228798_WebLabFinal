const User = require('../models/User');

/**
 * @desc    Get all members (users with role 'member')
 * @route   GET /api/members
 * @access  Private (Librarian, Admin)
 */
const getAllMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;

    // Build filter — only show members, not librarians/admins
    const filter = { role: 'member' };

    // Optional search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Optional filter by active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    const members = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        members,
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
 * @desc    Suspend or activate a member
 * @route   PATCH /api/members/:id/status
 * @access  Private (Admin only)
 */
const updateMemberStatus = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const { isActive } = req.body;

    // Validate isActive is provided
    if (isActive === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the isActive field (true or false).',
      });
    }

    // Find the member
    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found.',
      });
    }

    // Prevent admins from suspending other admins or librarians
    if (member.role !== 'member') {
      return res.status(403).json({
        success: false,
        message: `Cannot change status of a ${member.role}. This action is only for members.`,
      });
    }

    // Prevent self-suspension (edge case if admin is also querying members)
    if (member._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own status.',
      });
    }

    // Update the status
    member.isActive = isActive;
    await member.save();

    const action = isActive ? 'activated' : 'suspended';

    res.status(200).json({
      success: true,
      message: `Member ${member.name} has been ${action} successfully.`,
      data: {
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
          role: member.role,
          isActive: member.isActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMembers,
  updateMemberStatus,
};
