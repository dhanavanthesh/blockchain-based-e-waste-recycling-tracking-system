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
  Stack
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import api from '../../services/api';

const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { account, isConnected, connectMetaMask } = useWeb3();
  const [statistics, setStatistics] = useState({
    totalDevices: 0
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/manufacturer/statistics');
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Manufacturer Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.name}! 👋
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
              Connect your wallet to register devices on the blockchain
            </Typography>
          </Alert>
        ) : (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2" fontWeight="medium">
              Wallet Connected: {account?.substring(0, 6)}...{account?.substring(38)}
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
                      Total Devices
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.totalDevices}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Registered on blockchain
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 50, opacity: 0.3 }} />
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
                      {isConnected ? "Ready to register devices" : "Please connect wallet"}
                    </Typography>
                  </Box>
                  <WalletIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Your Role
                </Typography>
                <Chip
                  label="Manufacturer"
                  color="primary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" display="block" color="text.secondary">
                  Register and track electronic devices
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => navigate('/manufacturer/add-device')}
                disabled={!isConnected}
                sx={{
                  py: 2,
                  background: isConnected
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : undefined
                }}
              >
                Register New Device
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<ViewListIcon />}
                onClick={() => navigate('/manufacturer/devices')}
                sx={{ py: 2 }}
              >
                View All Devices
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* How It Works */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            How It Works
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
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
                  Connect Wallet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect your MetaMask wallet to interact with the blockchain
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
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
                  Register Devices
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add electronic devices with details and register them on blockchain
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
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
                  Track Lifecycle
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your devices through their entire lifecycle until recycling
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ManufacturerDashboard;
