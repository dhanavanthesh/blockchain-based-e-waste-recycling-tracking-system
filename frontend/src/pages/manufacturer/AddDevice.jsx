import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import api from '../../services/api';
import { ethers } from 'ethers';

const AddDevice = () => {
  const navigate = useNavigate();
  const { account, isConnected, contract } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    category: '',
    model: '',
    serialNumber: '',
    weight: '',
    materials: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isConnected) {
      setError('Please connect your MetaMask wallet first');
      return;
    }

    if (!contract) {
      setError('Smart contract not loaded. Please refresh the page.');
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.manufacturer || !formData.category ||
        !formData.model || !formData.serialNumber) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // STEP 1: Send blockchain transaction via MetaMask
      console.log('Sending blockchain transaction...');
      const tx = await contract.registerDevice(
        formData.name,
        formData.manufacturer
      );

      console.log('Transaction sent, waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Get device ID from event (ethers v6 style)
      let blockchainId = null;

      // Parse logs to find DeviceRegistered event
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'DeviceRegistered') {
            blockchainId = Number(parsedLog.args.deviceId);
            console.log('Found device ID from event:', blockchainId);
            break;
          }
        } catch (error) {
          // Skip logs that don't match our contract
          continue;
        }
      }

      if (!blockchainId) {
        console.error('Could not find DeviceRegistered event in logs:', receipt.logs);
        throw new Error('Failed to get device ID from blockchain');
      }

      // STEP 2: Save metadata to backend database
      console.log('Saving device metadata to database...');
      const deviceData = {
        blockchainId: blockchainId,
        category: formData.category,
        model: formData.model,
        serialNumber: formData.serialNumber,
        weight: formData.weight ? parseFloat(formData.weight) : 0,
        materials: formData.materials ? formData.materials.split(',').map(m => m.trim()) : [],
        transactionHash: receipt.hash,
        walletAddress: account
      };

      const response = await api.post('/manufacturer/device/metadata', deviceData);

      if (response.data.success) {
        setSuccess(`Device registered successfully! Blockchain ID: ${blockchainId}`);

        // Reset form
        setFormData({
          name: '',
          manufacturer: '',
          category: '',
          model: '',
          serialNumber: '',
          weight: '',
          materials: ''
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/manufacturer/devices');
        }, 2000);
      }
    } catch (err) {
      console.error('Error registering device:', err);

      // Handle specific errors
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction rejected by user');
      } else if (err.message && err.message.includes('User not registered')) {
        setError('Your wallet is not registered on the blockchain. Please register first.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to register device. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/manufacturer/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>

        <Paper elevation={2} sx={{ p: 4 }}>
          <Box mb={3}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Register New Device
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add a new electronic device to the blockchain tracking system
            </Typography>
          </Box>

          {!isConnected && (
            <Alert severity="error" sx={{ mb: 3 }}>
              MetaMask wallet not connected. Please connect your wallet to register devices.
            </Alert>
          )}

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

          <Box component="form" onSubmit={handleSubmit}>
            <Divider sx={{ mb: 3 }}>
              <Chip label="Device Information" />
            </Divider>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Device Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., iPhone 13 Pro"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Manufacturer Name"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Apple Inc."
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Smartphone, Laptop"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="e.g., A2483"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Serial Number"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., DNPR2023XYZ123"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g., 0.204"
                  inputProps={{ step: '0.001', min: '0' }}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Materials (comma-separated)"
                  name="materials"
                  value={formData.materials}
                  onChange={handleChange}
                  placeholder="e.g., Aluminum, Glass, Lithium"
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Wallet Address"
                  value={account || 'Not connected'}
                  disabled
                  helperText="Your connected MetaMask wallet address"
                />
              </Grid>
            </Grid>

            <Box mt={4} display="flex" gap={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading || !isConnected}
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
              >
                {loading ? 'Registering on Blockchain...' : 'Register Device'}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/manufacturer/dashboard')}
                disabled={loading}
                sx={{ py: 1.5, minWidth: '120px' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddDevice;
