const Device = require('../models/Device');
const RecyclingReport = require('../models/RecyclingReport');
const { updateDeviceStatus, submitRecyclingReport, getDeviceFromChain } = require('../services/web3Service');
const dummyBlockchainService = require('../services/dummyBlockchainService');

// @desc    Get all devices in recycling for recycler
// @route   GET /api/recycler/devices
// @access  Private (Recycler only)
exports.getRecyclingDevices = async (req, res) => {
  try {
    const devices = await Device.find({
      currentOwnerId: req.user._id,
      status: { $in: ['in_recycling', 'collected'] }
    })
      .populate('manufacturerId', 'name email')
      .populate('ownershipHistory.ownerId', 'name email role')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: devices.length,
      devices
    });
  } catch (error) {
    console.error('Error getting recycling devices:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update device status (mark as collected, processing, etc.)
// @route   PUT /api/recycler/device/:id/status
// @access  Private (Recycler only)
exports.updateDeviceStatusByRecycler = async (req, res) => {
  try {
    const { status, transactionHash } = req.body;

    if (!status || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status and transactionHash'
      });
    }

    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Verify recycler owns the device
    if (device.currentOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this device'
      });
    }

    // Update device status
    device.status = status;
    device.transactionHashes.push(transactionHash);
    await device.save();

    res.status(200).json({
      success: true,
      message: 'Device status updated successfully',
      device
    });
  } catch (error) {
    console.error('Error updating device status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit recycling report on blockchain (dummy)
// @route   POST /api/recycler/submit-report-blockchain
// @access  Private (Recycler only)
exports.submitReportBlockchain = async (req, res) => {
  try {
    const { deviceId, weight, components, walletAddress } = req.body;

    if (!deviceId || !weight || !components || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deviceId, weight, components, and walletAddress'
      });
    }

    // Submit report on "blockchain"
    const result = await dummyBlockchainService.submitRecyclingReport(
      deviceId,
      weight,
      components,
      walletAddress
    );

    res.status(200).json({
      success: true,
      reportId: result.reportId,
      transactionHash: result.transactionHash,
      blockNumber: result.blockNumber,
      message: 'Recycling report submitted on blockchain successfully'
    });
  } catch (error) {
    console.error('Error submitting report on blockchain:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit recycling report
// @route   POST /api/recycler/report
// @access  Private (Recycler only)
exports.submitReport = async (req, res) => {
  try {
    const {
      deviceId,
      blockchainReportId,
      weight,
      components,
      notes,
      transactionHash
    } = req.body;

    if (!deviceId || !blockchainReportId || !weight || !components || !transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
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

    // Verify recycler owns the device
    if (device.currentOwnerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to report this device'
      });
    }

    // Create recycling report
    const report = await RecyclingReport.create({
      blockchainReportId,
      deviceId: device._id,
      recyclerId: req.user._id,
      weight,
      components,
      notes,
      transactionHash
    });

    // Update device status to recycled
    device.status = 'recycled';
    device.recyclingReportId = report._id;
    device.transactionHashes.push(transactionHash);
    await device.save();

    res.status(201).json({
      success: true,
      message: 'Recycling report submitted successfully',
      report
    });
  } catch (error) {
    console.error('Error submitting recycling report:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all recycling reports submitted by recycler
// @route   GET /api/recycler/reports
// @access  Private (Recycler only)
exports.getRecyclerReports = async (req, res) => {
  try {
    const reports = await RecyclingReport.find({ recyclerId: req.user._id })
      .populate('deviceId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error('Error getting recycler reports:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get report details
// @route   GET /api/recycler/report/:id
// @access  Private
exports.getReportDetails = async (req, res) => {
  try {
    const report = await RecyclingReport.findById(req.params.id)
      .populate('deviceId')
      .populate('recyclerId', 'name email')
      .populate('verifiedBy', 'name email');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error getting report details:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recycler statistics
// @route   GET /api/recycler/statistics
// @access  Private (Recycler only)
exports.getStatistics = async (req, res) => {
  try {
    const collectedDevices = await Device.countDocuments({
      currentOwnerId: req.user._id,
      status: { $in: ['collected', 'in_recycling'] }
    });

    const recycledDevices = await Device.countDocuments({
      currentOwnerId: req.user._id,
      status: 'recycled'
    });

    const totalReports = await RecyclingReport.countDocuments({
      recyclerId: req.user._id
    });

    const verifiedReports = await RecyclingReport.countDocuments({
      recyclerId: req.user._id,
      verified: true
    });

    const pendingReports = totalReports - verifiedReports;

    res.status(200).json({
      success: true,
      statistics: {
        collectedDevices,
        recycledDevices,
        totalReports,
        verifiedReports,
        pendingReports
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

// @desc    Upload recycling photos
// @route   POST /api/recycler/upload-photos
// @access  Private (Recycler only)
exports.uploadRecyclingPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one photo'
      });
    }

    const photos = req.files.map(file => `/uploads/${file.filename}`);

    res.status(200).json({
      success: true,
      photos
    });
  } catch (error) {
    console.error('Error uploading photos:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
