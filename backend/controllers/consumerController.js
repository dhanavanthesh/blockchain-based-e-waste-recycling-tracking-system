const Device = require('../models/Device');
const dummyBlockchainService = require('../services/dummyBlockchainService');

// @desc    Scan device QR code and get device info
// @route   GET /api/consumer/scan/:blockchainId
// @access  Private (Consumer only)
exports.scanDevice = async (req, res) => {
  try {
    const { blockchainId } = req.params;

    // Get device from MongoDB
    const device = await Device.findOne({ blockchainId })
      .populate('manufacturerId', 'name email')
      .populate('currentOwnerId', 'name email role');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found in database'
      });
    }

    // Get blockchain data
    const blockchainData = await dummyBlockchainService.getDevice(blockchainId);

    // Get device history
    const history = await dummyBlockchainService.getDeviceHistory(blockchainId);

    res.status(200).json({
      success: true,
      device: {
        ...device.toObject(),
        blockchainData,
        history
      }
    });
  } catch (error) {
    console.error('Error scanning device:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Claim device on blockchain (dummy)
// @route   POST /api/consumer/claim-device-blockchain
// @access  Private (Consumer only)
exports.claimDeviceBlockchain = async (req, res) => {
  try {
    const { blockchainId, walletAddress } = req.body;

    if (!blockchainId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blockchainId and walletAddress'
      });
    }

    // Claim device on "blockchain"
    const result = await dummyBlockchainService.claimDeviceOnChain(
      blockchainId,
      walletAddress
    );

    res.status(200).json({
      success: true,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      message: 'Device claimed on blockchain successfully'
    });
  } catch (error) {
    console.error('Error claiming device on blockchain:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Transfer device ownership on blockchain (dummy)
// @route   POST /api/consumer/transfer-blockchain
// @access  Private (Consumer only)
exports.transferDeviceBlockchain = async (req, res) => {
  try {
    const { deviceId, newOwnerAddress, walletAddress } = req.body;

    if (!deviceId || !newOwnerAddress || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId, newOwnerAddress, and walletAddress'
      });
    }

    // Transfer device on "blockchain"
    const result = await dummyBlockchainService.transferDeviceOwnership(
      deviceId,
      newOwnerAddress,
      walletAddress
    );

    res.status(200).json({
      success: true,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      message: 'Device transferred on blockchain successfully'
    });
  } catch (error) {
    console.error('Error transferring device on blockchain:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Request device ownership (after purchase/scan)
// @route   POST /api/consumer/claim-device
// @access  Private (Consumer only)
exports.claimDevice = async (req, res) => {
  try {
    const { blockchainId, walletAddress, transactionHash } = req.body;

    if (!blockchainId || !walletAddress || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blockchainId, walletAddress, and transactionHash'
      });
    }

    // Find device
    const device = await Device.findOne({ blockchainId });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Update device ownership in MongoDB
    device.currentOwnerId = req.user._id;
    device.ownershipHistory.push({
      ownerId: req.user._id,
      transferDate: new Date()
    });
    device.transactionHashes.push(transactionHash);

    await device.save();

    res.status(200).json({
      success: true,
      message: 'Device ownership claimed successfully',
      device
    });
  } catch (error) {
    console.error('Error claiming device:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all devices owned by consumer
// @route   GET /api/consumer/devices
// @access  Private (Consumer only)
exports.getMyDevices = async (req, res) => {
  try {
    const devices = await Device.find({
      currentOwnerId: req.user._id,
      status: { $ne: 'recycled' } // Exclude recycled devices
    })
      .populate('manufacturerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: devices.length,
      devices
    });
  } catch (error) {
    console.error('Error getting devices:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get device details with full history
// @route   GET /api/consumer/device/:id
// @access  Private
exports.getDeviceDetails = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('manufacturerId', 'name email')
      .populate('currentOwnerId', 'name email role')
      .populate('ownershipHistory.ownerId', 'name email role');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Get blockchain data
    const blockchainData = await dummyBlockchainService.getDevice(device.blockchainId);
    const history = await dummyBlockchainService.getDeviceHistory(device.blockchainId);

    res.status(200).json({
      success: true,
      device: {
        ...device.toObject(),
        blockchainData,
        history
      }
    });
  } catch (error) {
    console.error('Error getting device details:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Initiate device recycling (transfer to recycler)
// @route   POST /api/consumer/recycle-device
// @access  Private (Consumer only)
exports.recycleDevice = async (req, res) => {
  try {
    const { deviceId, recyclerAddress, transactionHash } = req.body;

    if (!deviceId || !recyclerAddress || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId, recyclerAddress, and transactionHash'
      });
    }

    // Find device
    const device = await Device.findById(deviceId);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Verify ownership
    if (device.currentOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not own this device'
      });
    }

    // Find recycler user
    const User = require('../models/User');
    const recycler = await User.findOne({ walletAddress: recyclerAddress, role: 'recycler' });

    if (!recycler) {
      return res.status(404).json({
        success: false,
        message: 'Recycler not found'
      });
    }

    // Update device status
    device.status = 'in_recycling';
    device.currentOwnerId = recycler._id;
    device.ownershipHistory.push({
      ownerId: recycler._id,
      transferDate: new Date()
    });
    device.transactionHashes.push(transactionHash);

    await device.save();

    res.status(200).json({
      success: true,
      message: 'Device sent for recycling successfully',
      device
    });
  } catch (error) {
    console.error('Error recycling device:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get consumer statistics
// @route   GET /api/consumer/statistics
// @access  Private (Consumer only)
exports.getStatistics = async (req, res) => {
  try {
    const ownedDevices = await Device.countDocuments({
      currentOwnerId: req.user._id,
      status: { $nin: ['recycled', 'in_recycling'] }
    });

    const recycledDevices = await Device.countDocuments({
      ownershipHistory: {
        $elemMatch: { ownerId: req.user._id }
      },
      status: { $in: ['recycled', 'in_recycling'] }
    });

    res.status(200).json({
      success: true,
      statistics: {
        ownedDevices,
        recycledDevices
      }
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
