const Permission = require('../models/Permission');

// @desc    Get all permissions
// @route   GET /api/permissions
// @access  Private/Admin
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ resource: 1, action: 1 });
    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllPermissions,
}; 