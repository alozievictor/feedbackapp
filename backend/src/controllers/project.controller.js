const Project = require('../models/project.model');
const User = require('../models/user.model');
const { validationResult } = require('express-validator');

// Get all projects
exports.getAllProjects = async (req, res, next) => {
  try {
    let query = {};
    
    // If user is client, only return their projects
    if (req.user.role === 'client') {
      query.clientId = req.user._id;
    }
    
    // Handle client filtering if requested by admin
    if (req.query.clientId && req.user.role === 'admin') {
      query.clientId = req.query.clientId;
    }
    
    // Handle status filtering
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Handle search
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    const projects = await Project.find(query)
      .sort({ updatedAt: -1 })
      .populate('files');
    
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// Create new project (admin only)
exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Only admin can create projects
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create projects' });
    }
    
    const { name, description, clientId, clientName, clientEmail } = req.body;
    
    let client;
    
    // If clientId is provided, use existing client
    if (clientId) {
      client = await User.findById(clientId);
      if (!client || client.role !== 'client') {
        return res.status(400).json({ message: 'Invalid client ID' });
      }
    } 
    // If clientName and clientEmail are provided, create a new client
    else if (clientName && clientEmail) {
      // Generate a random password for the new client
      const password = Math.random().toString(36).slice(-8);
      
      // Create new client user
      client = await User.create({
        name: clientName,
        email: clientEmail,
        password,
        role: 'client'
      });
      
      // TODO: Send email to client with their credentials
    } else {
      return res.status(400).json({ message: 'Either clientId or clientName and clientEmail must be provided' });
    }
    
    // Create project
    const project = await Project.create({
      name,
      description,
      clientId: client._id,
      clientName: client.name,
      clientEmail: client.email,
      activity: [
        {
          action: 'Project created',
          userId: req.user._id,
          userName: req.user.name,
        },
      ],
    });
    
    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Get project by ID
exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate id
    if (!id || id === 'undefined') {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    const project = await Project.findById(id).populate('files');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission to view this project
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }
    
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// Update project
exports.updateProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Only admin can update most project details
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }
    
    const { name, description, status } = req.body;
    
    // Find project
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Update project fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (status) project.status = status;
    
    // Add activity
    project.activity.unshift({
      action: `Project ${status ? 'status updated to ' + status : 'details updated'}`,
      userId: req.user._id,
      userName: req.user.name,
    });
    
    // Save project
    await project.save();
    
    res.status(200).json({
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Delete project (admin only)
exports.deleteProject = async (req, res, next) => {
  try {
    // Only admin can delete projects
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete projects' });
    }
    
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Note: In a real application, you would also delete associated files and feedback
    
    res.status(200).json({
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
