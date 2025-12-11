/**
 * Dummy Blockchain Utilities
 * Functions to simulate blockchain operations on the frontend
 */

/**
 * Generate a dummy wallet address
 * Format: 0xDUMMY + 36 hex characters (total 42 characters)
 */
export const generateDummyAddress = () => {
  const randomBytes = new Uint8Array(18);
  window.crypto.getRandomValues(randomBytes);

  const hexString = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return '0xDUMMY' + hexString;
};

/**
 * Generate a dummy transaction hash
 * Format: 0x + 64 hex characters
 */
export const generateTxHash = () => {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);

  const hexString = Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return '0x' + hexString;
};

/**
 * Simulate transaction delay (2-5 seconds)
 */
export const simulateTransactionDelay = async () => {
  const delay = Math.random() * 3000 + 2000; // 2-5 seconds
  await new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Generate dummy gas estimation
 */
export const estimateGas = () => {
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
 * Truncate wallet address for display
 * 0x1234...5678
 */
export const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Load dummy wallets from localStorage
 */
export const loadDummyWallets = () => {
  try {
    const stored = localStorage.getItem('dummyWallets');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading dummy wallets:', error);
  }
  return [];
};

/**
 * Save dummy wallets to localStorage
 */
export const saveDummyWallets = (wallets) => {
  try {
    localStorage.setItem('dummyWallets', JSON.stringify(wallets));
  } catch (error) {
    console.error('Error saving dummy wallets:', error);
  }
};

/**
 * Get current active wallet from localStorage
 */
export const getCurrentWallet = () => {
  try {
    return localStorage.getItem('currentDummyWallet');
  } catch (error) {
    console.error('Error getting current wallet:', error);
    return null;
  }
};

/**
 * Set current active wallet in localStorage
 */
export const setCurrentWallet = (address) => {
  try {
    localStorage.setItem('currentDummyWallet', address);
  } catch (error) {
    console.error('Error setting current wallet:', error);
  }
};

/**
 * Create a new dummy wallet
 */
export const createDummyWallet = (alias = null) => {
  const address = generateDummyAddress();
  const wallets = loadDummyWallets();

  const newWallet = {
    address,
    alias: alias || `Account ${wallets.length + 1}`,
    createdAt: new Date().toISOString()
  };

  wallets.push(newWallet);
  saveDummyWallets(wallets);
  setCurrentWallet(address);

  return newWallet;
};
