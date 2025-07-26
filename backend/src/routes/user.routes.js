const express = require('express');
const router = express.Router();
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');

// All user routes require authentication
router.use(authenticate);

// Routes accessible by both admin and regular users
router.get('/profile', (req, res, next) => {
  req.params.id = req.user._id;
  getUserById(req, res, next);
}); 

router.put('/profile', (req, res, next) => {
  req.params.id = req.user._id;
  updateUser(req, res, next);
});

// Admin-only routes
router.get('/', isAdmin, getAllUsers);
router.get('/:id', isAdmin, getUserById);
router.put('/:id', isAdmin, updateUser);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;
