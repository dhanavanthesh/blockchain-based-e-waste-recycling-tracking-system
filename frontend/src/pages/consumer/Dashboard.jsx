import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Chip,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Devices as DevicesIcon,
  QrCode as QrCodeIcon,
  Recycling as RecyclingIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import QRScanner from '../../components/qr/QRScanner';
import DeviceTimeline from '../../components/device/DeviceTimeline';
import api from '../../services/api';
import WalletRegistrationPrompt from '../../components/common/WalletRegistrationPrompt';

const ConsumerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { account, contract, isConnected, connectMetaMask } = useWeb3();
  const [statistics, setStatistics] = useState({
    ownedDevices: 0,
    recycledDevices: 0
  });

  // Scanner state
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedDevice, setScannedDevice] = useState(null);
  const [deviceDialog, setDeviceDialog] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState('');
  const [isRegisteredOnChain, setIsRegisteredOnChain] = useState(false);
  const [hasConsumerRole, setHasConsumerRole] = useState(false);

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (contract && account) {
      checkBlockchainRegistration();
    }
  }, [contract, account]);

  const checkBlockchainRegistration = async () => {
    if (!contract || !account) return;

    try {
      const registered = await contract.isUserRegistered(account);
      setIsRegisteredOnChain(registered);
      console.log('Blockchain registration status:', registered);

      // Check if wallet has Consumer role specifically (Role.Consumer = 2)
      const consumerRole = await contract.hasRole(account, 2);
      setHasConsumerRole(consumerRole);
      console.log('Has Consumer role:', consumerRole);
    } catch (error) {
      console.error('Error checking blockchain registration:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/consumer/statistics');
      setStatistics(response.data.statistics);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleScan = async (blockchainId) => {
    try {
      setError('');
      const response = await api.get(`/consumer/scan/${blockchainId}`);
      setScannedDevice(response.data.device);
      setScannerOpen(false);
      setDeviceDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan device');
      setScannerOpen(false);
    }
  };

  const handleClaimDevice = async () => {
    if (!isConnected || !contract || !scannedDevice) {
      setError('Please connect your MetaMask wallet');
      return;
    }

    try {
      setClaiming(true);
      setError('');

      // Claim device on blockchain (ethers.js v6 syntax)
      const tx = await contract.claimDevice(scannedDevice.blockchainId);

      console.log('Transaction sent, waiting for confirmation...');
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Update in backend
      await api.post('/consumer/claim-device', {
        blockchainId: scannedDevice.blockchainId,
        walletAddress: account,
        transactionHash: receipt.hash
      });

      setDeviceDialog(false);
      setScannedDevice(null);
      fetchStatistics();
      alert('Device claimed successfully!');
    } catch (err) {
      console.error('Claim error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to claim device');
    } finally {
      setClaiming(false);
    }
  };

  // Check if wallet is connected
  if (!isConnected || !account) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <WalletRegistrationPrompt role="consumer" />
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Consumer Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.name}!
          </Typography>
        </Box>

        {/* MetaMask Connection Alert */}
        {!isConnected ? (
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={connectMetaMask}
                variant="outlined"
              >
                Connect Now
              </Button>
            }
          >
            <Typography variant="body1" fontWeight="medium">
              MetaMask Not Connected
            </Typography>
            <Typography variant="body2">
              Connect your wallet to manage your devices
            </Typography>
          </Alert>
        ) : !hasConsumerRole ? (
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => navigate('/consumer/register-wallet')}
                variant="outlined"
              >
                {isRegisteredOnChain ? 'Add Consumer Role' : 'Register Now'}
              </Button>
            }
          >
            <Typography variant="body1" fontWeight="medium">
              {isRegisteredOnChain ? 'Consumer Role Not Added' : 'Wallet Not Registered on Blockchain'}
            </Typography>
            <Typography variant="body2">
              {isRegisteredOnChain
                ? `Your wallet is registered but missing the Consumer role. Click "Add Consumer Role" to add it.`
                : `Register your wallet (${account?.substring(0, 6)}...${account?.substring(38)}) on the blockchain to claim devices`
              }
            </Typography>
          </Alert>
        ) : (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" fontWeight="medium">
              Wallet Connected & Registered as Consumer: {account?.substring(0, 6)}...{account?.substring(38)}
            </Typography>
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Owned Devices
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.ownedDevices}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Currently in possession
                    </Typography>
                  </Box>
                  <DevicesIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Recycled Devices
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.recycledDevices}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Properly disposed
                    </Typography>
                  </Box>
                  <RecyclingIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Blockchain Status
                    </Typography>
                    <Chip
                      label={isConnected ? "Connected" : "Disconnected"}
                      color={isConnected ? "success" : "error"}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {isConnected ? "Ready to manage devices" : "Please connect wallet"}
                    </Typography>
                  </Box>
                  <WalletIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<QrCodeIcon />}
                disabled={!isConnected || !hasConsumerRole}
                onClick={() => setScannerOpen(true)}
                sx={{
                  py: 2,
                  background: (isConnected && hasConsumerRole)
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : undefined
                }}
              >
                Scan Device QR
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<DevicesIcon />}
                onClick={() => navigate('/consumer/devices')}
                sx={{ py: 2 }}
              >
                My Devices
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<RecyclingIcon />}
                onClick={() => navigate('/consumer/devices')}
                sx={{ py: 2 }}
              >
                Recycle Device
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<HistoryIcon />}
                onClick={() => navigate('/consumer/devices')}
                sx={{ py: 2 }}
              >
                History
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* How It Works */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            How to Use
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  1
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Verify Ownership
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scan QR code on your device to verify authenticity
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  2
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Track History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View complete lifecycle of your devices
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  3
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Initiate Recycling
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send devices to certified recyclers
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box textAlign="center" p={2}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'warning.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}
                >
                  4
                </Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Get Certificate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receive blockchain-verified recycling proof
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* QR Scanner Dialog */}
      <QRScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />

      {/* Scanned Device Dialog */}
      <Dialog open={deviceDialog} onClose={() => !claiming && setDeviceDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Device Scanned Successfully</DialogTitle>
        <DialogContent>
          {scannedDevice && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                This device is authentic and registered on the blockchain!
              </Alert>

              <Typography variant="h6" gutterBottom>
                {scannedDevice.specifications?.model}
              </Typography>

              <Grid container spacing={2} mb={3}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Serial Number:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {scannedDevice.specifications?.serialNumber}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Blockchain ID:</strong>
                  </Typography>
                  <Typography variant="body2">
                    #{scannedDevice.blockchainId}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Manufacturer:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {scannedDevice.manufacturerId?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Current Owner:</strong>
                  </Typography>
                  <Typography variant="body2">
                    {scannedDevice.currentOwnerId?.name || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom>
                Device History
              </Typography>
              <DeviceTimeline device={scannedDevice} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeviceDialog(false)} disabled={claiming}>
            Cancel
          </Button>
          <Button
            onClick={handleClaimDevice}
            variant="contained"
            disabled={claiming || !isConnected}
          >
            {claiming ? <CircularProgress size={24} /> : 'Claim Ownership'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsumerDashboard;
