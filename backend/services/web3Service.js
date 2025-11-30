const { Web3 } = require('web3');
const { contractABI, contractAddress } = require('../config/web3Config');

let web3;
let contract;

// Initialize Web3 and contract instance
const initWeb3 = () => {
  try {
    // Connect to Ganache
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545'));

    // Create contract instance
    contract = new web3.eth.Contract(contractABI, contractAddress);

    console.log('✅ Web3 initialized successfully');
    console.log(`📄 Contract Address: ${contractAddress}`);

    return { web3, contract };
  } catch (error) {
    console.error('❌ Web3 initialization error:', error.message);
    throw error;
  }
};

// Get Web3 instance
const getWeb3 = () => {
  if (!web3) {
    initWeb3();
  }
  return web3;
};

// Get contract instance
const getContract = () => {
  if (!contract) {
    initWeb3();
  }
  return contract;
};

// Register device on blockchain
const registerDeviceOnChain = async (name, manufacturer, fromAddress) => {
  try {
    const contract = getContract();
    const web3 = getWeb3();

    // Estimate gas
    const gasEstimate = await contract.methods
      .registerDevice(name, manufacturer)
      .estimateGas({ from: fromAddress });

    // Send transaction
    const receipt = await contract.methods
      .registerDevice(name, manufacturer)
      .send({
        from: fromAddress,
        gas: gasEstimate + 10000n // Add buffer
      });

    // Get device ID from event
    const deviceId = receipt.events.DeviceRegistered.returnValues.deviceId;

    return {
      deviceId: Number(deviceId),
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error registering device on blockchain:', error);
    throw error;
  }
};

// Transfer device ownership
const transferDeviceOwnership = async (deviceId, newOwner, fromAddress) => {
  try {
    const contract = getContract();

    const gasEstimate = await contract.methods
      .transferOwnership(deviceId, newOwner)
      .estimateGas({ from: fromAddress });

    const receipt = await contract.methods
      .transferOwnership(deviceId, newOwner)
      .send({
        from: fromAddress,
        gas: gasEstimate + 10000n
      });

    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error transferring ownership:', error);
    throw error;
  }
};

// Update device status
const updateDeviceStatus = async (deviceId, status, fromAddress) => {
  try {
    const contract = getContract();

    const gasEstimate = await contract.methods
      .updateDeviceStatus(deviceId, status)
      .estimateGas({ from: fromAddress });

    const receipt = await contract.methods
      .updateDeviceStatus(deviceId, status)
      .send({
        from: fromAddress,
        gas: gasEstimate + 10000n
      });

    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error updating device status:', error);
    throw error;
  }
};

// Submit recycling report
const submitRecyclingReport = async (deviceId, weight, components, fromAddress) => {
  try {
    const contract = getContract();

    const gasEstimate = await contract.methods
      .submitRecyclingReport(deviceId, weight, components)
      .estimateGas({ from: fromAddress });

    const receipt = await contract.methods
      .submitRecyclingReport(deviceId, weight, components)
      .send({
        from: fromAddress,
        gas: gasEstimate + 10000n
      });

    const reportId = receipt.events.RecyclingReportSubmitted.returnValues.reportId;

    return {
      reportId: Number(reportId),
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error submitting recycling report:', error);
    throw error;
  }
};

// Verify recycling report
const verifyReport = async (reportId, fromAddress) => {
  try {
    const contract = getContract();

    const gasEstimate = await contract.methods
      .verifyReport(reportId)
      .estimateGas({ from: fromAddress });

    const receipt = await contract.methods
      .verifyReport(reportId)
      .send({
        from: fromAddress,
        gas: gasEstimate + 10000n
      });

    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error verifying report:', error);
    throw error;
  }
};

// Get device details from blockchain
const getDeviceFromChain = async (deviceId) => {
  try {
    const contract = getContract();
    const device = await contract.methods.getDevice(deviceId).call();

    return {
      id: Number(device.id),
      name: device.name,
      manufacturer: device.manufacturer,
      manufacturerAddress: device.manufacturerAddress,
      currentOwner: device.currentOwner,
      status: Number(device.status),
      manufacturedDate: Number(device.manufacturedDate),
      lastUpdated: Number(device.lastUpdated)
    };
  } catch (error) {
    console.error('Error getting device from blockchain:', error);
    throw error;
  }
};

// Get device ownership history
const getDeviceHistory = async (deviceId) => {
  try {
    const contract = getContract();
    const history = await contract.methods.getDeviceHistory(deviceId).call();
    return history;
  } catch (error) {
    console.error('Error getting device history:', error);
    throw error;
  }
};

// Get recycling report from blockchain
const getRecyclingReportFromChain = async (reportId) => {
  try {
    const contract = getContract();
    const report = await contract.methods.getRecyclingReport(reportId).call();

    return {
      id: Number(report.id),
      deviceId: Number(report.deviceId),
      recyclerAddress: report.recyclerAddress,
      weight: Number(report.weight),
      components: report.components,
      timestamp: Number(report.timestamp),
      verified: report.verified,
      verifiedBy: report.verifiedBy
    };
  } catch (error) {
    console.error('Error getting recycling report:', error);
    throw error;
  }
};

// Register user on blockchain
const registerUserOnChain = async (role, fromAddress) => {
  try {
    const contract = getContract();

    // Map string role to enum (1=Manufacturer, 2=Consumer, 3=Recycler, 4=Regulator)
    const roleMap = {
      'manufacturer': 1,
      'consumer': 2,
      'recycler': 3,
      'regulator': 4
    };

    const roleEnum = roleMap[role.toLowerCase()];

    if (!roleEnum) {
      throw new Error('Invalid role');
    }

    const gasEstimate = await contract.methods
      .registerUser(roleEnum)
      .estimateGas({ from: fromAddress });

    const receipt = await contract.methods
      .registerUser(roleEnum)
      .send({
        from: fromAddress,
        gas: gasEstimate + 10000n
      });

    return {
      transactionHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('Error registering user on blockchain:', error);
    throw error;
  }
};

module.exports = {
  initWeb3,
  getWeb3,
  getContract,
  registerDeviceOnChain,
  transferDeviceOwnership,
  updateDeviceStatus,
  submitRecyclingReport,
  verifyReport,
  getDeviceFromChain,
  getDeviceHistory,
  getRecyclingReportFromChain,
  registerUserOnChain
};
