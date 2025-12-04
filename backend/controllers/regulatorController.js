const Device = require('../models/Device');
const RecyclingReport = require('../models/RecyclingReport');
const User = require('../models/User');
const { verifyReport, getRecyclingReportFromChain } = require('../services/web3Service');

// @desc    Get all devices in system (for monitoring)
// @route   GET /api/regulator/devices
// @access  Private (Regulator only)
exports.getAllDevices = async (req, res) => {
  try {
    const { status, manufacturer, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (manufacturer) query.manufacturerId = manufacturer;

    const skip = (page - 1) * limit;

    const devices = await Device.find(query)
      .populate('manufacturerId', 'name email')
      .populate('currentOwnerId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Device.countDocuments(query);

    res.status(200).json({
      success: true,
      count: devices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
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

// @desc    Get all recycling reports (for verification)
// @route   GET /api/regulator/reports
// @access  Private (Regulator only)
exports.getAllReports = async (req, res) => {
  try {
    const { verified, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    const skip = (page - 1) * limit;

    const reports = await RecyclingReport.find(query)
      .populate('deviceId')
      .populate('recyclerId', 'name email')
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await RecyclingReport.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reports.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      reports
    });
  } catch (error) {
    console.error('Error getting reports:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify recycling report
// @route   PUT /api/regulator/report/:id/verify
// @access  Private (Regulator only)
exports.verifyRecyclingReport = async (req, res) => {
  try {
    const { transactionHash } = req.body;

    if (!transactionHash) {
      return res.status(400).json({
        success: false,
        message: 'Please provide transactionHash'
      });
    }

    const report = await RecyclingReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.verified) {
      return res.status(400).json({
        success: false,
        message: 'Report is already verified'
      });
    }

    // Update report
    report.verified = true;
    report.verifiedBy = req.user._id;
    report.verificationDate = new Date();
    report.verificationTransactionHash = transactionHash;

    await report.save();

    res.status(200).json({
      success: true,
      message: 'Report verified successfully',
      report
    });
  } catch (error) {
    console.error('Error verifying report:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get system-wide statistics
// @route   GET /api/regulator/statistics
// @access  Private (Regulator only)
exports.getSystemStatistics = async (req, res) => {
  try {
    // Device statistics
    const totalDevices = await Device.countDocuments();
    const activeDevices = await Device.countDocuments({ status: { $in: ['manufactured', 'in_use'] } });
    const inRecycling = await Device.countDocuments({ status: 'in_recycling' });
    const recycledDevices = await Device.countDocuments({ status: 'recycled' });

    // Report statistics
    const totalReports = await RecyclingReport.countDocuments();
    const verifiedReports = await RecyclingReport.countDocuments({ verified: true });
    const pendingReports = totalReports - verifiedReports;

    // User statistics
    const totalManufacturers = await User.countDocuments({ role: 'manufacturer' });
    const totalConsumers = await User.countDocuments({ role: 'consumer' });
    const totalRecyclers = await User.countDocuments({ role: 'recycler' });

    // Device status breakdown
    const statusBreakdown = await Device.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Recycling rate calculation
    const recyclingRate = totalDevices > 0
      ? ((recycledDevices / totalDevices) * 100).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      statistics: {
        devices: {
          total: totalDevices,
          active: activeDevices,
          inRecycling,
          recycled: recycledDevices,
          recyclingRate: `${recyclingRate}%`,
          statusBreakdown
        },
        reports: {
          total: totalReports,
          verified: verifiedReports,
          pending: pendingReports
        },
        users: {
          manufacturers: totalManufacturers,
          consumers: totalConsumers,
          recyclers: totalRecyclers,
          total: totalManufacturers + totalConsumers + totalRecyclers
        }
      }
    });
  } catch (error) {
    console.error('Error getting system statistics:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get device history and compliance info
// @route   GET /api/regulator/device/:id
// @access  Private (Regulator only)
exports.getDeviceCompliance = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('manufacturerId', 'name email walletAddress')
      .populate('currentOwnerId', 'name email role walletAddress')
      .populate('ownershipHistory.ownerId', 'name email role walletAddress')
      .populate('recyclingReportId');

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    // Calculate compliance score
    let complianceScore = 0;
    const checks = {
      hasManufacturer: !!device.manufacturerId,
      hasSerialNumber: !!device.specifications.serialNumber,
      hasQRCode: !!device.qrCode,
      isTracked: device.ownershipHistory.length > 0,
      isRecycled: device.status === 'recycled',
      hasRecyclingReport: !!device.recyclingReportId
    };

    const totalChecks = Object.keys(checks).length;
    const passedChecks = Object.values(checks).filter(v => v).length;
    complianceScore = ((passedChecks / totalChecks) * 100).toFixed(0);

    res.status(200).json({
      success: true,
      device,
      compliance: {
        score: `${complianceScore}%`,
        checks,
        status: complianceScore >= 80 ? 'Compliant' : complianceScore >= 50 ? 'Partial' : 'Non-Compliant'
      }
    });
  } catch (error) {
    console.error('Error getting device compliance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get manufacturers list
// @route   GET /api/regulator/manufacturers
// @access  Private (Regulator only)
exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await User.find({ role: 'manufacturer' })
      .select('name email walletAddress createdAt');

    // Get device count for each manufacturer
    const manufacturersWithStats = await Promise.all(
      manufacturers.map(async (manufacturer) => {
        const deviceCount = await Device.countDocuments({ manufacturerId: manufacturer._id });
        return {
          ...manufacturer.toObject(),
          deviceCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: manufacturersWithStats.length,
      manufacturers: manufacturersWithStats
    });
  } catch (error) {
    console.error('Error getting manufacturers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recyclers list
// @route   GET /api/regulator/recyclers
// @access  Private (Regulator only)
exports.getRecyclers = async (req, res) => {
  try {
    const recyclers = await User.find({ role: 'recycler' })
      .select('name email walletAddress createdAt');

    // Get report count for each recycler
    const recyclersWithStats = await Promise.all(
      recyclers.map(async (recycler) => {
        const reportCount = await RecyclingReport.countDocuments({ recyclerId: recycler._id });
        const verifiedCount = await RecyclingReport.countDocuments({
          recyclerId: recycler._id,
          verified: true
        });
        return {
          ...recycler.toObject(),
          reportCount,
          verifiedCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: recyclersWithStats.length,
      recyclers: recyclersWithStats
    });
  } catch (error) {
    console.error('Error getting recyclers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
