const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  linkWallet
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/link-wallet', protect, linkWallet);

module.exports = router;
