const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
  getFeedbackByFile,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  toggleResolveFeedback,
} = require('../controllers/feedback.controller');

// All feedback routes require authentication
router.use(authenticate);

// Routes for feedback
router.get('/file/:fileId', getFeedbackByFile);
router.post('/file/:fileId', createFeedback);
router.put('/:feedbackId', updateFeedback);
router.delete('/:feedbackId', deleteFeedback);
router.patch('/:feedbackId/resolve', toggleResolveFeedback);

module.exports = router;
