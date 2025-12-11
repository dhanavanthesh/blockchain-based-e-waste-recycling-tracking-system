const Device = require('../models/Device');
const { registerDeviceOnChain, getDeviceFromChain } = require('../services/web3Service');
const { generateDeviceQR } = require('../services/qrService');
const dummyBlockchainService = require('../services/dummyBlockchainService');

// @desc    Register a new device (OLD - with blockchain transaction)
// @route   POST /api/manufacturer/device
// @access  Private (Manufacturer only)
exports.registerDevice = async (req, res) => {
  try {
    const { name, manufacturer, category, model, serialNumber, weight, materials, walletAddress } = req.body;

    // Validate required fields
    if (!name || !manufacturer || !category || !model || !serialNumber || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Register device on blockchain
    const blockchainResult = await registerDeviceOnChain(name, manufacturer, walletAddress);

    // Create device in MongoDB
    const device = await Device.create({
      blockchainId: blockchainResult.deviceId,
      specifications: {
        category,
        model,
        serialNumber,
        weight: weight || 0,
        materials: materials || []
      },
      manufacturerId: req.user._id,
      currentOwnerId: req.user._id,
      transactionHashes: [blockchainResult.transactionHash]
    });

    // Generate QR code
    const qrCode = await generateDeviceQR({
      blockchainId: blockchainResult.deviceId,
      manufacturerId: req.user._id,
      specifications: { serialNumber }
    });

    device.qrCode = qrCode;
    await device.save();

    res.status(201).json({
      success: true,
      message: 'Device registered successfully',
      device: {
        id: device._id,
        blockchainId: device.blockchainId,
        qrCode: device.qrCode,
        specifications: device.specifications,
        transactionHash: blockchainResult.transactionHash
      }
    });
  } catch (error) {
    console.error('Error registering device:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Register device on blockchain (dummy)
// @route   POST /api/manufacturer/device/blockchain
// @access  Private (Manufacturer only)
exports.registerDeviceBlockchain = async (req, res) => {
  try {
    const { name, manufacturer, walletAddress } = req.body;

    // Validate required fields
    if (!name || !manufacturer || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Register device on "blockchain"
    const result = await dummyBlockchainService.registerDeviceOnChain(
      name,
      manufacturer,
      walletAddress
    );

    res.status(200).json({
      success: true,
      deviceId: result.deviceId,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      message: 'Device registered on blockchain successfully'
    });
  } catch (error) {
    console.error('Error registering device on blockchain:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Save device metadata (after blockchain transaction from frontend)
// @route   POST /api/manufacturer/device/metadata
// @access  Private (Manufacturer only)
exports.saveDeviceMetadata = async (req, res) => {
  try {
    const { blockchainId, category, model, serialNumber, weight, materials, transactionHash, walletAddress } = req.body;

    // Validate required fields
    if (!blockchainId || !category || !model || !serialNumber || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if device already exists
    const existingDevice = await Device.findOne({ blockchainId });
    if (existingDevice) {
      return res.status(400).json({
        success: false,
        message: 'Device with this blockchain ID already exists'
      });
    }

    // Create device in MongoDB
    const device = await Device.create({
      blockchainId,
      specifications: {
        category,
        model,
        serialNumber,
        weight: weight || 0,
        materials: materials || []
      },
      manufacturerId: req.user._id,
      currentOwnerId: req.user._id,
      transactionHashes: [transactionHash]
    });

    // Generate QR code
    const qrCode = await generateDeviceQR({
      blockchainId: blockchainId,
      manufacturerId: req.user._id,
      specifications: { serialNumber }
    });

    device.qrCode = qrCode;
    await device.save();

    res.status(201).json({
      success: true,
      message: 'Device metadata saved successfully',
      device: {
        id: device._id,
        blockchainId: device.blockchainId,
        qrCode: device.qrCode,
        specifications: device.specifications,
        transactionHash: transactionHash
      }
    });
  } catch (error) {
    console.error('Error saving device metadata:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all devices for manufacturer
// @route   GET /api/manufacturer/devices
// @access  Private (Manufacturer only)
exports.getManufacturerDevices = async (req, res) => {
  try {
    const devices = await Device.find({ manufacturerId: req.user._id })
      .populate('currentOwnerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: devices.length,
      devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get device details
// @route   GET /api/manufacturer/device/:id
// @access  Private
exports.getDeviceDetails = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('manufacturerId', 'name email')
      .populate('currentOwnerId', 'name email');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Get blockchain data
    const blockchainData = await getDeviceFromChain(device.blockchainId);

    res.status(200).json({
      success: true,
      device: {
        ...device.toObject(),
        blockchainData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/manufacturer/statistics
// @access  Private (Manufacturer only)
exports.getStatistics = async (req, res) => {
  try {
    const totalDevices = await Device.countDocuments({ manufacturerId: req.user._id });

    // Additional statistics can be added here

    res.status(200).json({
      success: true,
      statistics: {
        totalDevices,
        // Add more stats as needed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
