const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const dummyBlockchainService = require('../services/dummyBlockchainService');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Link wallet address to user account
// @route   POST /api/auth/link-wallet
// @access  Private
exports.linkWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide wallet address'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.walletAddress = walletAddress.toLowerCase();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Wallet linked successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register wallet on blockchain
// @route   POST /api/auth/register-blockchain
// @access  Private
exports.registerOnBlockchain = async (req, res) => {
  try {
    const { walletAddress } = req.body;
    const user = req.user;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide wallet address'
      });
    }

    // Register wallet on "blockchain" with user's role
    const result = await dummyBlockchainService.registerUserOnChain(
      walletAddress,
      user.role
    );

    res.status(200).json({
      success: true,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      message: 'Wallet registered on blockchain successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if wallet has specific role
// @route   GET /api/auth/check-role
// @access  Public
exports.checkRole = async (req, res) => {
  try {
    const { address, role } = req.query;

    if (!address || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide address and role'
      });
    }

    const hasRole = await dummyBlockchainService.hasRole(address, role);

    res.status(200).json({
      success: true,
      hasRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Check if wallet is registered on blockchain
// @route   GET /api/auth/check-registration
// @access  Public
exports.checkRegistration = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide address'
      });
    }

    const isRegistered = await dummyBlockchainService.isUserRegistered(address);

    res.status(200).json({
      success: true,
      isRegistered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
