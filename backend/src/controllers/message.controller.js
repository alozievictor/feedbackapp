const Message = require('../models/message.model');
const Project = require('../models/project.model');
const path = require('path');
const fs = require('fs');

// Get all messages for a project
exports.getMessagesByProject = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    
    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    // Find the project first
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission to view project messages
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these messages' });
    }
    
    // Get messages for this project with populated sender information
    const messages = await Message.find({ projectId })
      .populate('sender', 'name email role')
      .sort({ createdAt: 1 });
    
    // Format messages to match frontend expectations
    const formattedMessages = messages.map(message => {
      return {
        _id: message._id,
        text: message.text,
        sender: message.sender,
        createdAt: message.createdAt,
        attachments: message.attachments && message.attachments.length > 0 
          ? message.attachments.map(attachment => ({
              ...attachment,
              url: `${req.protocol}://${req.get('host')}/${attachment.path}`,
              name: attachment.filename, // Add name field for compatibility with frontend
            })) 
          : []
      };
    });
    
    res.status(200).json(formattedMessages);
  } catch (error) {
    next(error);
  }
};

// Create a new message
exports.createMessage = async (req, res, next) => {
  try {
    console.log('Create message request received');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { projectId, text } = req.body;
    
    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      console.log('Invalid project ID:', projectId);
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    // Find the project first
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission to add messages to this project
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to send messages to this project' });
    }
    
    // Process uploaded files if any
    const attachments = [];
    
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          filename: file.originalname,
          path: file.path.replace(/\\/g, '/'),
          size: file.size,
          type: file.mimetype,
        });
      });
    }
    
    // Create message
    const message = new Message({
      text: text || '',
      projectId,
      sender: req.user._id,
      attachments,
    });
    
    await message.save();
    
    // Add activity to project
    project.activity.push({
      action: `${req.user.name} sent a message${attachments.length > 0 ? ' with attachments' : ''}`,
      userId: req.user._id,
    });
    
    await project.save();
    
    // Populate sender information for response
    await message.populate('sender', 'name email role');
    
    // Format response
    const formattedMessage = {
      _id: message._id,
      text: message.text,
      sender: message.sender,
      createdAt: message.createdAt,
      attachments: message.attachments.map(attachment => ({
        ...attachment,
        url: `${req.protocol}://${req.get('host')}/${attachment.path}`
      }))
    };
    
    res.status(201).json(formattedMessage);
  } catch (error) {
    next(error);
  }
};

// Mark message as read
exports.markMessageAsRead = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    
    // Find the message
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Find the project
    const project = await Project.findById(message.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Mark as read if not already
    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }
    
    res.status(200).json({ message: 'Message marked as read' });
  } catch (error) {
    next(error);
  }
};
