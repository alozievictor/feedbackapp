const Feedback = require('../models/feedback.model');
const File = require('../models/file.model');
const Project = require('../models/project.model');

// Get all feedback for a file
exports.getFeedbackByFile = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    
    // Find the file first
    const file = await File.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Find the project to check permissions
    const project = await Project.findById(file.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission to view feedback
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this feedback' });
    }
    
    // Get feedback for this file
    const feedback = await Feedback.find({ fileId })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });
    
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

// Create new feedback
exports.createFeedback = async (req, res, next) => {
  try {
    const { content, x, y, width, height } = req.body;
    const fileId = req.params.fileId;
    
    if (!content) {
      return res.status(400).json({ message: 'Feedback content is required' });
    }
    
    // Find the file
    const file = await File.findById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Find the project to check permissions
    const project = await Project.findById(file.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Both admin and client can add feedback
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add feedback' });
    }
    
    // Create feedback
    const feedback = await Feedback.create({
      content,
      fileId,
      projectId: file.projectId,
      createdBy: req.user._id,
      coordinates: {
        x: x || 0,
        y: y || 0,
        width: width || 0,
        height: height || 0,
      },
    });
    
    // Add feedback to file's feedback array
    file.feedback.push(feedback._id);
    await file.save();
    
    // Add activity to project
    project.activity.unshift({
      action: `New feedback added by ${req.user.name}`,
      userId: req.user._id,
      userName: req.user.name,
    });
    await project.save();
    
    // Populate the creator's info
    await feedback.populate('createdBy', 'name email role');
    
    res.status(201).json({
      message: 'Feedback added successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Update feedback
exports.updateFeedback = async (req, res, next) => {
  try {
    const { content, status, x, y, width, height } = req.body;
    const feedbackId = req.params.feedbackId;
    
    // Find the feedback
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Only the creator or admin can update feedback
    if (req.user.role !== 'admin' && feedback.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this feedback' });
    }
    
    // Update feedback
    if (content) feedback.content = content;
    if (status) feedback.status = status;
    
    if (x !== undefined || y !== undefined || width !== undefined || height !== undefined) {
      feedback.coordinates = {
        x: x !== undefined ? x : feedback.coordinates.x,
        y: y !== undefined ? y : feedback.coordinates.y,
        width: width !== undefined ? width : feedback.coordinates.width,
        height: height !== undefined ? height : feedback.coordinates.height,
      };
    }
    
    await feedback.save();
    
    // Find project to add activity
    const project = await Project.findById(feedback.projectId);
    if (project) {
      project.activity.unshift({
        action: `Feedback updated by ${req.user.name}`,
        userId: req.user._id,
        userName: req.user.name,
      });
      await project.save();
    }
    
    // Populate the creator's info
    await feedback.populate('createdBy', 'name email role');
    
    res.status(200).json({
      message: 'Feedback updated successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res, next) => {
  try {
    const feedbackId = req.params.feedbackId;
    
    // Find the feedback
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Only the creator or admin can delete feedback
    if (req.user.role !== 'admin' && feedback.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this feedback' });
    }
    
    // Remove feedback from file's feedback array
    const file = await File.findById(feedback.fileId);
    if (file) {
      file.feedback = file.feedback.filter(
        (id) => id.toString() !== feedback._id.toString()
      );
      await file.save();
    }
    
    // Find project to add activity
    const project = await Project.findById(feedback.projectId);
    if (project) {
      project.activity.unshift({
        action: `Feedback deleted by ${req.user.name}`,
        userId: req.user._id,
        userName: req.user.name,
      });
      await project.save();
    }
    
    // Delete feedback
    await feedback.remove();
    
    res.status(200).json({
      message: 'Feedback deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Resolve/unresolve feedback
exports.toggleResolveFeedback = async (req, res, next) => {
  try {
    const feedbackId = req.params.feedbackId;
    
    // Find the feedback
    const feedback = await Feedback.findById(feedbackId);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Only admin can resolve/unresolve feedback
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can resolve feedback' });
    }
    
    // Toggle the status
    feedback.status = feedback.status === 'resolved' ? 'open' : 'resolved';
    
    await feedback.save();
    
    // Find project to add activity
    const project = await Project.findById(feedback.projectId);
    if (project) {
      project.activity.unshift({
        action: `Feedback ${feedback.status === 'resolved' ? 'resolved' : 'reopened'} by ${req.user.name}`,
        userId: req.user._id,
        userName: req.user.name,
      });
      await project.save();
    }
    
    // Populate the creator's info
    await feedback.populate('createdBy', 'name email role');
    
    res.status(200).json({
      message: `Feedback ${feedback.status === 'resolved' ? 'resolved' : 'reopened'} successfully`,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};
