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
  Devices as DevicesIcon,
  QrCode as QrCodeIcon,
  Recycling as RecyclingIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';

const ConsumerDashboard = () => {
  const { user } = useAuth();
  const { account, isConnected, connectMetaMask } = useWeb3();
  const [statistics, setStatistics] = useState({
    ownedDevices: 0,
    recycledDevices: 0
  });

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
                disabled={!isConnected}
                sx={{
                  py: 2,
                  background: isConnected
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
    </Box>
  );
};

export default ConsumerDashboard;
