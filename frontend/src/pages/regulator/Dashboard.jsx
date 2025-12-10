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
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  VerifiedUser as VerifiedUserIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  PieChart as PieChartIcon,
  CloudDownload as CloudDownloadIcon,
  Search as SearchIcon,
  Gavel as GavelIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';
import WalletRegistrationPrompt from '../../components/common/WalletRegistrationPrompt';

const RegulatorDashboard = () => {
  const { user } = useAuth();
  const { account, isConnected, connectMetaMask } = useWeb3();
  const [statistics] = useState({
    totalDevices: 0,
    recycledDevices: 0,
    activeManufacturers: 0,
    activeRecyclers: 0,
    complianceRate: 0
  });

  // Check if wallet is connected
  if (!isConnected || !account) {
    return (
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <WalletRegistrationPrompt role="regulator" />
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
            Regulator Dashboard
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
              Connect your wallet to access regulatory data
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
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Total Devices Tracked
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.totalDevices}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      In the ecosystem
                    </Typography>
                  </Box>
                  <TimelineIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white'
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }} gutterBottom>
                      Recycling Rate
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {statistics.complianceRate}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Compliance level
                    </Typography>
                  </Box>
                  <PieChartIcon sx={{ fontSize: 50, opacity: 0.3 }} />
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
                      Active Participants
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {statistics.activeManufacturers + statistics.activeRecyclers}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={`${statistics.activeManufacturers} Manufacturers`} size="small" />
                      <Chip label={`${statistics.activeRecyclers} Recyclers`} size="small" color="primary" />
                    </Stack>
                  </Box>
                  <VerifiedUserIcon sx={{ fontSize: 40, color: 'text.secondary', opacity: 0.3 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Regulatory Tools
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AssessmentIcon />}
                disabled={!isConnected}
                sx={{
                  py: 2,
                  background: isConnected
                    ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                    : undefined
                }}
              >
                View Reports
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<SearchIcon />}
                sx={{ py: 2 }}
              >
                Track Device
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<CloudDownloadIcon />}
                sx={{ py: 2 }}
              >
                Export Data
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                startIcon={<GavelIcon />}
                sx={{ py: 2 }}
              >
                Compliance
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Monitoring Capabilities */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            What You Can Monitor
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {[
              'Device Registration Trends',
              'Recycling Completion Rates',
              'Manufacturer Compliance',
              'Recycler Certifications',
              'Material Recovery Stats',
              'Environmental Impact',
              'Supply Chain Transparency',
              'Audit Trail Records'
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%)',
                    border: '2px solid #4facfe20'
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {item}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Regulatory Process */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Regulatory Oversight Process
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
                  Monitor Activities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track all blockchain transactions and device movements
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
                  Analyze Compliance
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Generate reports and identify non-compliance issues
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
                  Enforce Standards
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ensure adherence to environmental regulations
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegulatorDashboard;
