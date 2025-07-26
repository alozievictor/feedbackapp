const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const {
  getFilesByProject,
  uploadFile,
  getFileById,
  deleteFile,
} = require('../controllers/file.controller');

console.log('File routes initialized with upload middleware');

// All file routes require authentication
router.use(authenticate);

// Routes for files
router.get('/project/:projectId', getFilesByProject);
router.post('/project/:projectId', upload.single('file'), uploadFile);
router.get('/:fileId', getFileById);
router.delete('/:fileId', deleteFile);

module.exports = router;
