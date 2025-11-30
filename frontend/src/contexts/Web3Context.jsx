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

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const network = await provider.getNetwork();

          setProvider(provider);
          setSigner(signer);
          setAccount(address);
          setChainId(network.chainId);
          setIsConnected(true);

          // Load contract if address is available
          if (CONTRACT_ADDRESS) {
            loadContract(signer);
          }
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const loadContract = async (signerInstance) => {
    try {
      const contractABI = require('../config/contractABI.json');
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signerInstance
      );
      setContract(contractInstance);
    } catch (error) {
      console.error('Error loading contract:', error);
    }
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to use this application.');
      return { success: false, message: 'MetaMask not installed' };
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(address);
      setChainId(network.chainId);
      setIsConnected(true);

      if (CONTRACT_ADDRESS) {
        await loadContract(signer);
      }

      return { success: true, account: address };
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      return {
        success: false,
        message: error.message || 'Failed to connect to MetaMask'
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
    connectMetaMask,
    disconnect
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
