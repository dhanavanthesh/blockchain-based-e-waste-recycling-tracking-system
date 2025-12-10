import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../utils/constants';

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider');
  }
  return context;
};

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [isRegisteredOnChain, setIsRegisteredOnChain] = useState(false);

  useEffect(() => {
    // Only check connection if MetaMask is installed
    if (window.ethereum) {
      checkConnection();
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Check registration status when contract and account are loaded
  useEffect(() => {
    if (contract && account) {
      checkBlockchainRegistration(account);
    }
  }, [contract, account]);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        // Check if already connected without requesting permissions
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });

        if (accounts && accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();

          setProvider(provider);
          setSigner(signer);
          setAccount(address);
          setChainId(Number(network.chainId));
          setIsConnected(true);

          // Load contract if address is available
          if (CONTRACT_ADDRESS) {
            loadContract(signer);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        // Don't show error to user for auto-check on load
      }
    }
  };

  const loadContract = async (signerInstance) => {
    try {
      if (!CONTRACT_ADDRESS) {
        console.warn('Contract address not configured');
        return;
      }

      const contractJSON = require('../config/contractABI.json');
      const contractABI = contractJSON.abi; // Extract just the ABI array
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signerInstance
      );
      setContract(contractInstance);
      console.log('Contract loaded successfully at:', CONTRACT_ADDRESS);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };

  const checkBlockchainRegistration = async (address) => {
    if (!contract || !address) return false;

    try {
      console.log('Checking registration for:', address);
      console.log('Contract address:', await contract.getAddress());
      console.log('Provider network:', await provider.getNetwork());

      // Use .staticCall() for explicit read-only call in ethers v6
      const registered = await contract.isUserRegistered.staticCall(address);
      console.log('Registration result:', registered);

      setIsRegisteredOnChain(registered);
      return registered;
    } catch (error) {
      console.error('Error checking blockchain registration:', error);
      console.error('Error details:', error.code, error.message);
      return false;
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to use this application.');
      return { success: false, message: 'MetaMask not installed' };
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      if (CONTRACT_ADDRESS) {
        await loadContract(signer);
      }

      return { success: true, account: address };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      
      let errorMessage = 'Failed to connect to MetaMask';
      
      if (error.code === 4001) {
        errorMessage = 'Connection request rejected by user';
      } else if (error.code === -32002) {
        errorMessage = 'Please check MetaMask - a connection request may already be pending';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const disconnect = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setIsConnected(false);
    setChainId(null);
    setIsRegisteredOnChain(false);
  };

  const switchAccount = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed.');
      return { success: false, message: 'MetaMask not installed' };
    }

    try {
      // Request account switch - this will open MetaMask to select account
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{
          eth_accounts: {}
        }]
      });

      // After user selects account, reconnect
      await connectMetaMask();

      return { success: true };
    } catch (error) {
      console.error('Error switching account:', error);
      return {
        success: false,
        message: error.message || 'Failed to switch account'
      };
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const value = {
    account,
    provider,
    signer,
    contract,
    isConnected,
    chainId,
    isRegisteredOnChain,
    connectMetaMask,
    disconnect,
    switchAccount,
    checkBlockchainRegistration
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
