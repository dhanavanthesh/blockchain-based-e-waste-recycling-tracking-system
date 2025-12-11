const BlockchainCounter = require('../models/BlockchainCounter');
const BlockchainRegistration = require('../models/BlockchainRegistration');
const Device = require('../models/Device');
const RecyclingReport = require('../models/RecyclingReport');
const { generateTxHash, generateBlockNumber } = require('../utils/transactionGenerator');

/**
 * Dummy Blockchain Service
 * Simulates blockchain operations using MongoDB storage
 */

// ===== Counter Management =====

/**
 * Get next sequential device ID
 * @returns {Promise<number>}
 */
const getNextDeviceId = async () => {
  const counter = await BlockchainCounter.findOneAndUpdate(
    { name: 'deviceId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
};

/**
 * Get next sequential report ID
 * @returns {Promise<number>}
 */
const getNextReportId = async () => {
  const counter = await BlockchainCounter.findOneAndUpdate(
    { name: 'reportId' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
};

// ===== User/Wallet Registration =====

/**
 * Register user on "blockchain"
 * @param {string} walletAddress - User's wallet address
 * @param {string} role - User's role (manufacturer, consumer, recycler, regulator)
 * @returns {Promise<object>} Transaction receipt
 */
const registerUserOnChain = async (walletAddress, role) => {
  try {
    // Check if wallet already registered
    let registration = await BlockchainRegistration.findOne({
      walletAddress: walletAddress.toLowerCase()
    });

    if (!registration) {
      // Create new registration
      registration = new BlockchainRegistration({
        walletAddress: walletAddress.toLowerCase(),
        roles: [role],
        registrationDate: new Date()
      });
    } else {
      // Add new role to existing wallet (multi-role support)
      if (!registration.roles.includes(role)) {
        registration.roles.push(role);
      }
    }

    await registration.save();

    // Generate fake transaction
    const txHash = generateTxHash();
    const blockNumber = generateBlockNumber();

    return {
      transactionHash: txHash,
      blockNumber: blockNumber,
      success: true
    };
  } catch (error) {
    console.error('Error registering user on chain:', error);
    throw error;
  }
};

/**
 * Check if wallet has specific role
 * @param {string} walletAddress - Wallet address to check
 * @param {string} role - Role to check for
 * @returns {Promise<boolean>}
 */
const hasRole = async (walletAddress, role) => {
  try {
    const registration = await BlockchainRegistration.findOne({
      walletAddress: walletAddress.toLowerCase()
    });
    return registration && registration.roles.includes(role);
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
};

/**
 * Check if wallet is registered
 * @param {string} walletAddress - Wallet address to check
 * @returns {Promise<boolean>}
 */
const isUserRegistered = async (walletAddress) => {
  try {
    const registration = await BlockchainRegistration.findOne({
      walletAddress: walletAddress.toLowerCase()
    });
    return !!registration;
  } catch (error) {
    console.error('Error checking registration:', error);
    return false;
  }
};

// ===== Device Operations =====

/**
 * Register device on "blockchain"
 * @param {string} name - Device name
 * @param {string} manufacturer - Manufacturer name
 * @param {string} walletAddress - Manufacturer's wallet address
 * @returns {Promise<object>} Device ID and transaction receipt
 */
const registerDeviceOnChain = async (name, manufacturer, walletAddress) => {
  try {
    // Verify wallet has manufacturer role
    const hasManufacturerRole = await hasRole(walletAddress, 'manufacturer');
    if (!hasManufacturerRole) {
      throw new Error('Wallet not registered as manufacturer');
    }

    // Generate blockchain ID
    const deviceId = await getNextDeviceId();
    const txHash = generateTxHash();
    const blockNumber = generateBlockNumber();

    return {
      deviceId: deviceId,
      transactionHash: txHash,
      blockNumber: blockNumber
    };
  } catch (error) {
    console.error('Error registering device on chain:', error);
    throw error;
  }
};

/**
 * Claim device on "blockchain"
 * @param {number} deviceId - Device blockchain ID
 * @param {string} walletAddress - Consumer's wallet address
 * @returns {Promise<object>} Transaction receipt
 */
const claimDeviceOnChain = async (deviceId, walletAddress) => {
  try {
    // Verify consumer role
    const hasConsumerRole = await hasRole(walletAddress, 'consumer');
    if (!hasConsumerRole) {
      throw new Error('Wallet not registered as consumer');
    }

    // Verify device exists in MongoDB
    const device = await Device.findOne({ blockchainId: deviceId });
    if (!device) {
      throw new Error('Device does not exist');
    }

    // Check device is still in "manufactured" state
    if (device.status !== 'manufactured') {
      throw new Error('Device already claimed or in use');
    }

    const txHash = generateTxHash();
    const blockNumber = generateBlockNumber();

    return {
      transactionHash: txHash,
      blockNumber: blockNumber
    };
  } catch (error) {
    console.error('Error claiming device on chain:', error);
    throw error;
  }
};

/**
 * Transfer device ownership on "blockchain"
 * @param {number} deviceId - Device blockchain ID
 * @param {string} newOwnerAddress - New owner's wallet address
 * @param {string} currentOwnerAddress - Current owner's wallet address
 * @returns {Promise<object>} Transaction receipt
 */
const transferDeviceOwnership = async (deviceId, newOwnerAddress, currentOwnerAddress) => {
  try {
    const device = await Device.findOne({ blockchainId: deviceId });

    if (!device) {
      throw new Error('Device does not exist');
    }

    // Verify new owner is registered
    const isRegistered = await isUserRegistered(newOwnerAddress);
    if (!isRegistered) {
      throw new Error('New owner not registered on blockchain');
    }

    const txHash = generateTxHash();
    const blockNumber = generateBlockNumber();

    return {
      transactionHash: txHash,
      blockNumber: blockNumber
    };
  } catch (error) {
    console.error('Error transferring device ownership:', error);
    throw error;
  }
};

/**
 * Get device details from "blockchain"
 * @param {number} deviceId - Device blockchain ID
 * @returns {Promise<object>} Device details
 */
const getDevice = async (deviceId) => {
  try {
    const device = await Device.findOne({ blockchainId: deviceId })
      .populate('manufacturerId')
      .populate('currentOwnerId');

    if (!device) {
      throw new Error('Device does not exist');
    }

    return {
      id: device.blockchainId,
      name: device.specifications?.model || 'Unknown',
      manufacturer: device.manufacturerId?.name || 'Unknown',
      manufacturerAddress: device.manufacturerId?.walletAddress || '',
      currentOwner: device.currentOwnerId?.walletAddress || '',
      status: device.status,
      manufacturedDate: device.createdAt.getTime(),
      lastUpdated: device.updatedAt.getTime()
    };
  } catch (error) {
    console.error('Error getting device from chain:', error);
    throw error;
  }
};

/**
 * Get device ownership history from "blockchain"
 * @param {number} deviceId - Device blockchain ID
 * @returns {Promise<Array>} Array of owner addresses
 */
const getDeviceHistory = async (deviceId) => {
  try {
    const device = await Device.findOne({ blockchainId: deviceId })
      .populate('ownershipHistory.ownerId');

    if (!device) {
      return [];
    }

    return device.ownershipHistory.map(entry => entry.ownerId.walletAddress);
  } catch (error) {
    console.error('Error getting device history:', error);
    return [];
  }
};

// ===== Recycling Operations =====

/**
 * Submit recycling report on "blockchain"
 * @param {number} deviceId - Device blockchain ID
 * @param {number} weight - Weight of recycled materials
 * @param {string} components - Recycled components description
 * @param {string} walletAddress - Recycler's wallet address
 * @returns {Promise<object>} Report ID and transaction receipt
 */
const submitRecyclingReport = async (deviceId, weight, components, walletAddress) => {
  try {
    const hasRecyclerRole = await hasRole(walletAddress, 'recycler');
    if (!hasRecyclerRole) {
      throw new Error('Wallet not registered as recycler');
    }

    const reportId = await getNextReportId();
    const txHash = generateTxHash();
    const blockNumber = generateBlockNumber();

    return {
      reportId: reportId,
      transactionHash: txHash,
      blockNumber: blockNumber
    };
  } catch (error) {
    console.error('Error submitting recycling report:', error);
    throw error;
  }
};

/**
 * Verify recycling report on "blockchain"
 * @param {number} reportId - Report blockchain ID
 * @param {string} walletAddress - Regulator's wallet address
 * @returns {Promise<object>} Transaction receipt
 */
const verifyReport = async (reportId, walletAddress) => {
  try {
    const hasRegulatorRole = await hasRole(walletAddress, 'regulator');
    if (!hasRegulatorRole) {
      throw new Error('Wallet not registered as regulator');
    }

    const report = await RecyclingReport.findOne({ blockchainId: reportId });
    if (!report) {
      throw new Error('Report does not exist');
    }

    if (report.verified) {
      throw new Error('Report already verified');
    }

    const txHash = generateTxHash();
    const blockNumber = generateBlockNumber();

    return {
      transactionHash: txHash,
      blockNumber: blockNumber
    };
  } catch (error) {
    console.error('Error verifying report:', error);
    throw error;
  }
};

/**
 * Get recycling report from "blockchain"
 * @param {number} reportId - Report blockchain ID
 * @returns {Promise<object>} Report details
 */
const getRecyclingReport = async (reportId) => {
  try {
    const report = await RecyclingReport.findOne({ blockchainId: reportId })
      .populate('recyclerId')
      .populate('verifiedBy');

    if (!report) {
      throw new Error('Report does not exist');
    }

    return {
      id: report.blockchainId,
      deviceId: report.deviceId,
      recyclerAddress: report.recyclerId?.walletAddress || '',
      weight: report.weight,
      components: report.components,
      timestamp: report.createdAt.getTime(),
      verified: report.verified,
      verifiedBy: report.verifiedBy ? report.verifiedBy.walletAddress : null
    };
  } catch (error) {
    console.error('Error getting recycling report:', error);
    throw error;
  }
};

module.exports = {
  // Counter management
  getNextDeviceId,
  getNextReportId,

  // User operations
  registerUserOnChain,
  hasRole,
  isUserRegistered,

  // Device operations
  registerDeviceOnChain,
  claimDeviceOnChain,
  transferDeviceOwnership,
  getDevice,
  getDeviceHistory,

  // Recycling operations
  submitRecyclingReport,
  verifyReport,
  getRecyclingReport
};
