const File = require('../models/file.model');
const Project = require('../models/project.model');
const path = require('path');
const fs = require('fs');

// Get all files for a project
exports.getFilesByProject = async (req, res, next) => {
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
    
    // Check if user has permission to view project files
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these files' });
    }
    
    // Get files for this project
    const files = await File.find({ projectId }).sort({ uploadDate: -1 });
    
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};

// Upload a new file
exports.uploadFile = async (req, res, next) => {
  try {
    // Debug request details
    console.log('File upload request received');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Check for file
    if (!req.file) {
      console.error('No file found in the request');
      console.log('Body:', req.body);
      console.log('Files:', req.files);
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Log file details
    console.log('File received:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      filename: req.file.filename
    });
    
    // Only admin can upload files
    if (req.user.role !== 'admin') {
      console.log('User role:', req.user.role);
      return res.status(403).json({ message: 'Not authorized to upload files' });
    }
    
    const projectId = req.params.projectId;
    
    // Validate projectId
    if (!projectId || projectId === 'undefined') {
      console.error('Invalid project ID:', projectId);
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      console.error('Project not found:', projectId);
      // Delete uploaded file if project doesn't exist
      if (req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Project not found' });
    }
    
    console.log('Project found:', project.name);
    
    // Get the file URL (for local storage)
    const fileUrl = `/uploads/${path.basename(req.file.path)}`;

    // Create file record
    const file = await File.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      url: fileUrl,
      path: req.file.path,
      type: req.file.mimetype,
      size: req.file.size,
      projectId,
      uploadedBy: req.user._id,
    });
    
    // Add file to project's files array
    project.files.push(file._id);
    
    // Add activity to project
    project.activity.unshift({
      action: `New file uploaded: ${file.name}`,
      userId: req.user._id,
      userName: req.user.name,
    });
    
    await project.save();
    
    res.status(201).json({
      message: 'File uploaded successfully',
      file,
    });
  } catch (error) {
    next(error);
  }
};

// Get a file by ID
exports.getFileById = async (req, res, next) => {
  try {
    const file = await File.findById(req.params.fileId).populate('feedback');
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if project exists
    const project = await Project.findById(file.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user has permission to view this file
    if (req.user.role !== 'admin' && project.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this file' });
    }
    
    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};

// Delete file
exports.deleteFile = async (req, res, next) => {
  try {
    // Only admin can delete files
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete files' });
    }
    
    const file = await File.findById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Delete file from local storage
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    
    // Remove file from project's files array
    const project = await Project.findById(file.projectId);
    if (project) {
      project.files = project.files.filter(
        (fileId) => fileId.toString() !== file._id.toString()
      );
      
      // Add activity to project
      project.activity.unshift({
        action: `File deleted: ${file.name}`,
        userId: req.user._id,
        userName: req.user.name,
      });
      
      await project.save();
    }
    
    // Delete file record from database
    await file.remove();
    
    res.status(200).json({
      message: 'File deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
