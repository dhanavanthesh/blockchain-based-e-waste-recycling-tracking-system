import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import {
  generateDummyAddress,
  simulateTransactionDelay,
  estimateGas,
  loadDummyWallets,
  saveDummyWallets,
  getCurrentWallet,
  setCurrentWallet as setCurrentWalletStorage,
  createDummyWallet
} from '../utils/dummyBlockchain';

const DummyWalletContext = createContext();

export const useWeb3 = () => {
  const context = useContext(DummyWalletContext);
  if (!context) {
    throw new Error('useWeb3 must be used within DummyWalletProvider');
  }
  return context;
};

export const DummyWalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRegisteredOnChain, setIsRegisteredOnChain] = useState(false);
  const [chainId, setChainId] = useState(1337); // Dummy chain ID

  // Transaction modal state
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionState, setTransactionState] = useState('idle'); // idle, pending, processing, success, failed
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  // Account switcher
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  useEffect(() => {
    // Auto-connect if wallet exists in localStorage
    checkConnection();
  }, []);

  useEffect(() => {
    // Check registration when account changes
    if (account) {
      checkBlockchainRegistration(account);
    }
  }, [account]);

  const checkConnection = () => {
    try {
      const currentWallet = getCurrentWallet();
      if (currentWallet) {
        setAccount(currentWallet);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connectMetaMask = () => {
    return new Promise((resolve, reject) => {
      setShowConnectModal(true);

      // Set up handlers for modal
      window.__dummyWalletConnectResolve = resolve;
      window.__dummyWalletConnectReject = reject;
    });
  };

  const handleConnectConfirm = async () => {
    try {
      // Check if wallet already exists
      let walletAddress = getCurrentWallet();

      if (!walletAddress) {
        // Create new dummy wallet
        const wallet = createDummyWallet();
        walletAddress = wallet.address;
      }

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAccount(walletAddress);
      setIsConnected(true);
      setShowConnectModal(false);

      if (window.__dummyWalletConnectResolve) {
        window.__dummyWalletConnectResolve({ success: true, account: walletAddress });
        delete window.__dummyWalletConnectResolve;
        delete window.__dummyWalletConnectReject;
      }

      return { success: true, account: walletAddress };
    } catch (error) {
      setShowConnectModal(false);
      if (window.__dummyWalletConnectReject) {
        window.__dummyWalletConnectReject(error);
        delete window.__dummyWalletConnectResolve;
        delete window.__dummyWalletConnectReject;
      }
      return { success: false, message: error.message };
    }
  };

  const handleConnectReject = () => {
    setShowConnectModal(false);
    if (window.__dummyWalletConnectReject) {
      window.__dummyWalletConnectReject(new Error('User rejected connection'));
      delete window.__dummyWalletConnectResolve;
      delete window.__dummyWalletConnectReject;
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setIsRegisteredOnChain(false);
    // Keep wallet in localStorage for reconnection
  };

  const switchAccount = () => {
    setShowAccountSwitcher(true);
  };

  const handleSwitchAccount = (newAddress) => {
    setCurrentWalletStorage(newAddress);
    setAccount(newAddress);
    setShowAccountSwitcher(false);
    checkBlockchainRegistration(newAddress);
  };

  const checkBlockchainRegistration = async (address) => {
    if (!address) return false;

    try {
      const response = await api.get('/auth/check-registration', {
        params: { address }
      });

      const registered = response.data.isRegistered;
      setIsRegisteredOnChain(registered);
      return registered;
    } catch (error) {
      console.error('Error checking blockchain registration:', error);
      return false;
    }
  };

  // Generic transaction handler
  const executeTransaction = async (transactionType, transactionFunction, transactionDetails = {}) => {
    return new Promise(async (resolve, reject) => {
      setCurrentTransaction({
        type: transactionType,
        details: transactionDetails,
        gasEstimation: estimateGas()
      });
      setShowTransactionModal(true);
      setTransactionState('pending');
      setTransactionError(null);

      // Store resolve/reject for modal handlers
      window.__dummyTransactionResolve = resolve;
      window.__dummyTransactionReject = reject;
      window.__dummyTransactionFunction = transactionFunction;
    });
  };

  const handleTransactionConfirm = async () => {
    try {
      setTransactionState('processing');

      // Simulate transaction delay
      await simulateTransactionDelay();

      // Execute the actual transaction function
      const result = await window.__dummyTransactionFunction();

      setTransactionState('success');

      // Auto-close after showing success
      setTimeout(() => {
        setShowTransactionModal(false);
        setTransactionState('idle');
        setCurrentTransaction(null);

        if (window.__dummyTransactionResolve) {
          window.__dummyTransactionResolve(result);
          delete window.__dummyTransactionResolve;
          delete window.__dummyTransactionReject;
          delete window.__dummyTransactionFunction;
        }
      }, 1500);

    } catch (error) {
      setTransactionState('failed');
      setTransactionError(error.message);

      if (window.__dummyTransactionReject) {
        window.__dummyTransactionReject(error);
        delete window.__dummyTransactionResolve;
        delete window.__dummyTransactionReject;
        delete window.__dummyTransactionFunction;
      }
    }
  };

  const handleTransactionReject = () => {
    setShowTransactionModal(false);
    setTransactionState('idle');
    setCurrentTransaction(null);

    const error = new Error('User rejected transaction');
    error.code = 'ACTION_REJECTED';

    if (window.__dummyTransactionReject) {
      window.__dummyTransactionReject(error);
      delete window.__dummyTransactionResolve;
      delete window.__dummyTransactionReject;
      delete window.__dummyTransactionFunction;
    }
  };

  const retryTransaction = () => {
    setTransactionState('pending');
    setTransactionError(null);
  };

  // Blockchain operations

  const registerUser = async (role) => {
    return executeTransaction(
      'Register User',
      async () => {
        const response = await api.post('/auth/register-blockchain', {
          walletAddress: account
        });

        // Update registration status
        setIsRegisteredOnChain(true);

        return {
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber
        };
      },
      { role }
    );
  };

  const registerDevice = async (name, manufacturer) => {
    return executeTransaction(
      'Register Device',
      async () => {
        const response = await api.post('/manufacturer/device/blockchain', {
          name,
          manufacturer,
          walletAddress: account
        });

        return {
          deviceId: response.data.deviceId,
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber
        };
      },
      { name, manufacturer }
    );
  };

  const claimDevice = async (deviceId) => {
    return executeTransaction(
      'Claim Device',
      async () => {
        const response = await api.post('/consumer/claim-device-blockchain', {
          blockchainId: deviceId,
          walletAddress: account
        });

        return {
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber
        };
      },
      { deviceId }
    );
  };

  const transferOwnership = async (deviceId, newOwner) => {
    return executeTransaction(
      'Transfer Ownership',
      async () => {
        const response = await api.post('/consumer/transfer-blockchain', {
          deviceId,
          newOwnerAddress: newOwner,
          walletAddress: account
        });

        return {
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber
        };
      },
      { deviceId, newOwner }
    );
  };

  const submitRecyclingReport = async (deviceId, weight, components) => {
    return executeTransaction(
      'Submit Recycling Report',
      async () => {
        const response = await api.post('/recycler/submit-report-blockchain', {
          deviceId,
          weight,
          components,
          walletAddress: account
        });

        return {
          reportId: response.data.reportId,
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber
        };
      },
      { deviceId, weight, components }
    );
  };

  const verifyReport = async (reportId) => {
    return executeTransaction(
      'Verify Report',
      async () => {
        const response = await api.post('/regulator/verify-report-blockchain', {
          reportId,
          walletAddress: account
        });

        return {
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber
        };
      },
      { reportId }
    );
  };

  const hasRole = async (address, roleNumber) => {
    // Map role number to string
    const roleMap = {
      1: 'manufacturer',
      2: 'consumer',
      3: 'recycler',
      4: 'regulator'
    };
    const roleString = roleMap[roleNumber];

    try {
      const response = await api.get('/auth/check-role', {
        params: { address, role: roleString }
      });
      return response.data.hasRole;
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  };

  const value = {
    account,
    isConnected,
    chainId,
    isRegisteredOnChain,
    connectMetaMask,
    disconnect,
    switchAccount,
    checkBlockchainRegistration,

    // Blockchain operations
    registerUser,
    registerDevice,
    claimDevice,
    transferOwnership,
    submitRecyclingReport,
    verifyReport,
    hasRole,

    // Modal states
    showConnectModal,
    showTransactionModal,
    showAccountSwitcher,
    transactionState,
    currentTransaction,
    transactionError,

    // Modal handlers
    handleConnectConfirm,
    handleConnectReject,
    handleTransactionConfirm,
    handleTransactionReject,
    handleSwitchAccount,
    retryTransaction,

    // Dummy contract and signer for compatibility
    contract: {
      interface: {
        parseLog: () => null
      }
    },
    signer: {},
    provider: {}
  };

  return (
    <DummyWalletContext.Provider value={value}>
      {children}
    </DummyWalletContext.Provider>
  );
};
