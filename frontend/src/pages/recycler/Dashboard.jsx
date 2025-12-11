import React, { useState } from 'react';
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
  Recycling as RecyclingIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  QrCodeScanner as QrCodeScannerIcon,
  PostAdd as PostAddIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/DummyWalletContext';
import WalletRegistrationPrompt from '../../components/common/WalletRegistrationPrompt';

const RecyclerDashboard = () => {
  const { user } = useAuth();
  const { account, isConnected, connectMetaMask } = useWeb3();
  const [statistics] = useState({
    processedDevices: 0,
    pendingDevices: 0,
    materialsRecovered: 0
  });

  // Check if wallet is connected
  if (!isConnected || !account) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <WalletRegistrationPrompt role="recycler" />
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
            Recycler Dashboard
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
              Connect your wallet to process recycling operations
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
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Processed Devices
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.processedDevices}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Successfully recycled
                    </Typography>
                  </Box>
                  <RecyclingIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Pending Devices
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.pendingDevices}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Awaiting processing
                    </Typography>
                  </Box>
                  <QrCodeScannerIcon sx={{ fontSize: 50, opacity: 0.3 }} />
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
                      {isConnected ? "Ready to process" : "Please connect wallet"}
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
                startIcon={<QrCodeScannerIcon />}
                disabled={!isConnected}
                sx={{
                  py: 2,
                  background: isConnected
                    ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                    : undefined
                }}
              >
                Scan Device
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
                Pending Queue
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<PostAddIcon />}
                sx={{ py: 2 }}
              >
                Issue Certificate
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<AssessmentIcon />}
                sx={{ py: 2 }}
              >
                Reports
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Recycling Process */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Recycling Process
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
                  Receive Device
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Scan and verify device QR code from consumer
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
                  Process & Extract
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Extract materials and record recovery data
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
                  Issue Certificate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record completion on blockchain and issue certificate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default RecyclerDashboard;
