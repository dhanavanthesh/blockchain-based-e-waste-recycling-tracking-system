import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import api from '../../services/api';

const ManufacturerRegisterWallet = () => {
  const navigate = useNavigate();
  const { account, isConnected, contract, connectMetaMask } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    'Connect MetaMask',
    'Register on Blockchain',
    'Link Wallet to Account'
  ];

  useEffect(() => {
    if (isConnected && account) {
      setActiveStep(1);
      checkIfRegistered();
    }
  }, [isConnected, account]);

  const checkIfRegistered = async () => {
    if (!contract || !account) return;

    try {
      const registered = await contract.isUserRegistered(account);
      setIsRegistered(registered);

      if (registered) {
        setActiveStep(3);
        setSuccess('Your wallet is already registered on the blockchain!');
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const handleConnectWallet = async () => {
    setError('');
    const result = await connectMetaMask();

    if (result.success) {
      setActiveStep(1);
    } else {
      setError(result.message);
    }
  };

  const handleRegisterOnBlockchain = async () => {
    if (!contract) {
      setError('Smart contract not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const alreadyRegistered = await contract.isUserRegistered(account);
      if (alreadyRegistered) {
        setIsRegistered(true);
        setActiveStep(2);
        setSuccess('Wallet already registered on blockchain! Linking to account...');
        await handleLinkWallet();
        return;
      }

      console.log('Registering on blockchain as Manufacturer...');
      const tx = await contract.registerUser(1); // 1 = Manufacturer

      console.log('Transaction sent, waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      setIsRegistered(true);
      setActiveStep(2);
      setSuccess('Successfully registered on blockchain! Now linking wallet to your account...');

      await handleLinkWallet();

    } catch (err) {
      console.error('Error registering on blockchain:', err);

      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user');
      } else if (err.message && err.message.includes('User already registered')) {
        setIsRegistered(true);
        setActiveStep(2);
        await handleLinkWallet();
      } else {
        setError(err.message || 'Failed to register on blockchain. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkWallet = async () => {
    setLoading(true);

    try {
      const response = await api.post('/auth/link-wallet', {
        walletAddress: account
      });

      if (response.data.success) {
        setActiveStep(3);
        setSuccess('Wallet successfully linked! You can now register devices.');

        setTimeout(() => {
          navigate('/manufacturer/dashboard');
        }, 2000);
      }
    } catch (err) {
      console.error('Error linking wallet:', err);
      setError(err.response?.data?.message || 'Failed to link wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <WalletIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Register Your Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Register as a Manufacturer to create and track devices
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {!isConnected && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" gutterBottom>
                Step 1: Connect Your Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Click the button below to connect your MetaMask wallet
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<WalletIcon />}
                onClick={handleConnectWallet}
                sx={{
                  py: 1.5,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Connect MetaMask
              </Button>
            </Box>
          )}

          {isConnected && !isRegistered && activeStep === 1 && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" gutterBottom>
                Step 2: Register on Blockchain
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Connected Wallet:
              </Typography>
              <Typography variant="body2" fontFamily="monospace" fontWeight="bold" mb={3}>
                {account}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Register your wallet address on the blockchain as a Manufacturer
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleRegisterOnBlockchain}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  py: 1.5,
                  px: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {loading ? 'Registering on Blockchain...' : 'Register on Blockchain'}
              </Button>
            </Box>
          )}

          {activeStep === 3 && (
            <Box textAlign="center" py={4}>
              <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Registration Complete!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Your wallet is now registered. Redirecting to dashboard...
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/manufacturer/dashboard')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ManufacturerRegisterWallet;
