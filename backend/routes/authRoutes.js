const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  linkWallet,
  registerOnBlockchain,
  checkRole,
  checkRegistration
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/link-wallet', protect, linkWallet);
router.post('/register-blockchain', protect, registerOnBlockchain);
router.get('/check-role', checkRole);
router.get('/check-registration', checkRegistration);

module.exports = router;
