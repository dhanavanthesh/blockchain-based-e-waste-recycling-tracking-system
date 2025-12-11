const crypto = require('crypto');

/**
 * Generate a dummy transaction hash
 * @returns {string} Transaction hash in format 0x... (64 hex characters)
 */
const generateTxHash = () => {
  return '0x' + crypto.randomBytes(32).toString('hex');
};

/**
 * Generate a dummy block number
 * @returns {number} Realistic looking block number
 */
const generateBlockNumber = () => {
  return Math.floor(Math.random() * 1000000) + 15000000;
};

/**
 * Simulate gas estimation for a transaction
 * @returns {object} Gas estimation details
 */
const simulateGasEstimation = () => {
  const gasLimit = Math.floor(Math.random() * 100000) + 50000;
  const gasPrice = 20; // gwei
  const maxFee = (Math.random() * 0.003 + 0.001).toFixed(4);
  const estimatedUSD = (Math.random() * 5 + 1).toFixed(2);

  return {
    gasLimit,
    gasPrice: `${gasPrice} gwei`,
    maxFee: `${maxFee} ETH`,
    estimatedUSD: `$${estimatedUSD}`
  };
};

/**
 * Generate a dummy wallet address
 * @returns {string} Wallet address in format 0xDUMMY... (42 characters total)
 */
const generateDummyAddress = () => {
  return '0xDUMMY' + crypto.randomBytes(18).toString('hex');
};

module.exports = {
  generateTxHash,
  generateBlockNumber,
  simulateGasEstimation,
  generateDummyAddress
};
