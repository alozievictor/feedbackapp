const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create message uploads directory if it doesn't exist
const messageUploadsDir = path.join(__dirname, '../../uploads/messages');
if (!fs.existsSync(messageUploadsDir)) {
  fs.mkdirSync(messageUploadsDir, { recursive: true });
}

// Configure storage for message attachments
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, messageUploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'message-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allow certain file types
  const allowedFileTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/postscript', // For AI files
    'image/vnd.adobe.photoshop', // For PSD files
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

// Create multer upload middleware for message attachments
const uploadMessageAttachments = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
}).array('attachments', 5); // Maximum 5 files per message

// Middleware to handle file uploads with error handling
const handleAttachmentUpload = (req, res, next) => {
  uploadMessageAttachments(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: `Upload error: ${err.message}` });
    }
    
    // Everything went fine, proceed
    next();
  });
};

// Get all messages for a project
router.get('/project/:projectId', protect, messageController.getMessagesByProject);

// Create a new message
router.post('/', protect, handleAttachmentUpload, messageController.createMessage);

// Mark message as read
router.patch('/:messageId/read', protect, messageController.markMessageAsRead);

module.exports = router;
