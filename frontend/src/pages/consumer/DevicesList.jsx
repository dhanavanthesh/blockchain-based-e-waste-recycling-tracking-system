import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import { Add as AddIcon, Recycling as RecyclingIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../../contexts/Web3Context';
import DeviceCard from '../../components/device/DeviceCard';
import DeviceTimeline from '../../components/device/DeviceTimeline';
import QRDisplay from '../../components/qr/QRDisplay';
import api from '../../services/api';

const DevicesList = () => {
  const navigate = useNavigate();
  const { account, contract, isConnected } = useWeb3();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dialog states
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [qrDialog, setQrDialog] = useState(false);
  const [recycleDialog, setRecycleDialog] = useState(false);
  const [recyclerAddress, setRecyclerAddress] = useState('');
  const [recycling, setRecycling] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consumer/devices');
      setDevices(response.data.devices);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (device) => {
    setSelectedDevice(device);
    setDetailsDialog(true);
  };

  const handleShowQR = (device) => {
    setSelectedDevice(device);
    setQrDialog(true);
  };

  const handleRecycleDevice = (device) => {
    setSelectedDevice(device);
    setRecycleDialog(true);
  };

  const submitRecycling = async () => {
    if (!isConnected || !contract || !selectedDevice) {
      setError('Please connect your MetaMask wallet');
      return;
    }

    try {
      setRecycling(true);
      setError('');

      // Transfer ownership on blockchain (ethers.js v6 syntax)
      const tx = await contract.transferOwnership(
        selectedDevice.blockchainId,
        recyclerAddress
      );

      console.log('Transaction sent, waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Update in backend
      await api.post('/consumer/recycle-device', {
        deviceId: selectedDevice._id,
        recyclerAddress: recyclerAddress,
        transactionHash: receipt.hash
      });

      setRecycleDialog(false);
      setRecyclerAddress('');
      fetchDevices();
      alert('Device sent for recycling successfully!');
    } catch (err) {
      console.error('Recycling error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to recycle device');
    } finally {
      setRecycling(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Devices
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and manage your electronic devices
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {devices.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body1">
            You don't have any devices yet. Scan a QR code to claim a device!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/consumer/dashboard')}
            sx={{ mt: 2 }}
          >
            Scan Device
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device._id}>
              <DeviceCard
                device={device}
                onViewDetails={handleViewDetails}
                onScanQR={handleShowQR}
              />
              <Button
                fullWidth
                variant="outlined"
                color="warning"
                startIcon={<RecyclingIcon />}
                onClick={() => handleRecycleDevice(device)}
                sx={{ mt: 1 }}
              >
                Recycle Device
              </Button>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Device Details Dialog */}
      <Dialog
        open={detailsDialog}
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Device Details</DialogTitle>
        <DialogContent>
          {selectedDevice && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedDevice.specifications?.model}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Serial: {selectedDevice.specifications?.serialNumber}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Ownership History
              </Typography>
              <DeviceTimeline device={selectedDevice} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      {selectedDevice && (
        <QRDisplay
          open={qrDialog}
          onClose={() => setQrDialog(false)}
          qrCode={selectedDevice.qrCode}
          deviceInfo={{
            blockchainId: selectedDevice.blockchainId,
            serialNumber: selectedDevice.specifications?.serialNumber,
            model: selectedDevice.specifications?.model
          }}
        />
      )}

      {/* Recycle Dialog */}
      <Dialog open={recycleDialog} onClose={() => !recycling && setRecycleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Recycle Device</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Enter the recycler's wallet address to transfer ownership
            </Alert>
            <TextField
              fullWidth
              label="Recycler Wallet Address"
              placeholder="0x..."
              value={recyclerAddress}
              onChange={(e) => setRecyclerAddress(e.target.value)}
              disabled={recycling}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRecycleDialog(false)} disabled={recycling}>
            Cancel
          </Button>
          <Button
            onClick={submitRecycling}
            variant="contained"
            color="warning"
            disabled={!recyclerAddress || recycling}
          >
            {recycling ? 'Processing...' : 'Recycle Device'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DevicesList;
