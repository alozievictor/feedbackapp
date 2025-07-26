const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get all users (admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    // Only get clients if the request specifies clients only
    const query = req.query.clients === 'true' ? { role: 'client' } : {};
    
    const users = await User.find(query).select('-password');
    
    // Get projects for each user from Project model if it exists
    const Project = require('../models/project.model');
    const enhancedUsers = await Promise.all(users.map(async (user) => {
      const userData = user.toObject();
      try {
        // Find projects where user is a client
        if (user.role === 'client') {
          const projects = await Project.find({ clients: user._id });
          userData.projects = projects.map(project => ({
            _id: project._id,
            name: project.name,
            status: project.status
          }));
        }
        return userData;
      } catch (err) {
        console.error(`Error fetching projects for user ${user._id}:`, err);
        userData.projects = [];
        return userData;
      }
    }));
    
    res.status(200).json(enhancedUsers);
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, company, position, avatar } = req.body;
    
    // Check if user is updating their own profile or is an admin
    if (req.user.role !== 'admin' && req.params.id !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, company, position, avatar },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    // Only admin can delete users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete users' });
    }
    
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
