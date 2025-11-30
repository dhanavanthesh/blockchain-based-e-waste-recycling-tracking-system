import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  Recycling as RecyclingIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Speed as SpeedIcon,
  Devices as DevicesIcon,
  TrackChanges as TrackChangesIcon,
  VerifiedUser as VerifiedUserIcon,
  Timeline as TimelineIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: '#667eea' }} />,
      title: 'Blockchain Security',
      description: 'Immutable records stored on the blockchain ensure data integrity and prevent tampering'
    },
    {
      icon: <VisibilityIcon sx={{ fontSize: 50, color: '#764ba2' }} />,
      title: 'Complete Transparency',
      description: 'Track the entire lifecycle of electronic devices from manufacturing to recycling'
    },
    {
      icon: <TrackChangesIcon sx={{ fontSize: 50, color: '#f093fb' }} />,
      title: 'Real-time Tracking',
      description: 'Monitor device status, location, and ownership changes in real-time'
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 50, color: '#4facfe' }} />,
      title: 'Verified Recycling',
      description: 'Ensure proper e-waste disposal with certified recycler verification'
    }
  ];

  const stakeholders = [
    {
      role: 'Manufacturers',
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      description: 'Register electronic devices and track their lifecycle',
      color: '#667eea'
    },
    {
      role: 'Consumers',
      icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
      description: 'Own devices and initiate recycling when needed',
      color: '#764ba2'
    },
    {
      role: 'Recyclers',
      icon: <RecyclingIcon sx={{ fontSize: 40 }} />,
      description: 'Process e-waste and update recycling status',
      color: '#f093fb'
    },
    {
      role: 'Regulators',
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      description: 'Monitor compliance and generate reports',
      color: '#4facfe'
    }
  ];

  const trackingCapabilities = [
    'Device Manufacturing Details',
    'Ownership History',
    'Location Tracking',
    'Status Updates',
    'Recycling Certificates',
    'Compliance Reports',
    'Material Recovery Data',
    'Environmental Impact Metrics'
  ];

  const workflows = [
    {
      role: 'Manufacturer',
      color: '#667eea',
      icon: <DevicesIcon sx={{ fontSize: 60 }} />,
      steps: [
        { step: 1, action: 'Connect MetaMask Wallet', description: 'Link blockchain wallet to the platform' },
        { step: 2, action: 'Register Device', description: 'Add device details (model, serial, specs)' },
        { step: 3, action: 'Mint on Blockchain', description: 'Create unique NFT for device on Ethereum' },
        { step: 4, action: 'Generate QR Code', description: 'Print QR code on device for tracking' },
        { step: 5, action: 'Track Lifecycle', description: 'Monitor device through its entire journey' }
      ],
      example: 'Samsung registers Galaxy S24, mints NFT #12345, attaches QR code, tracks until recycling'
    },
    {
      role: 'Consumer',
      color: '#764ba2',
      icon: <VisibilityIcon sx={{ fontSize: 60 }} />,
      steps: [
        { step: 1, action: 'Scan QR Code', description: 'Scan device QR when purchasing' },
        { step: 2, action: 'Verify Authenticity', description: 'Check blockchain for genuine product' },
        { step: 3, action: 'Own Device', description: 'Device ownership transferred to consumer wallet' },
        { step: 4, action: 'Use Product', description: 'Normal usage with blockchain tracking' },
        { step: 5, action: 'Initiate Recycling', description: 'Send to certified recycler when done' }
      ],
      example: 'John buys phone, scans QR, verifies on blockchain, uses for 2 years, sends to recycler'
    },
    {
      role: 'Recycler',
      color: '#f093fb',
      icon: <RecyclingIcon sx={{ fontSize: 60 }} />,
      steps: [
        { step: 1, action: 'Receive Device', description: 'Consumer sends device for recycling' },
        { step: 2, action: 'Scan & Verify', description: 'Verify device authenticity via blockchain' },
        { step: 3, action: 'Process E-waste', description: 'Extract materials (gold, copper, plastics)' },
        { step: 4, action: 'Record Materials', description: 'Log recovered materials on blockchain' },
        { step: 5, action: 'Issue Certificate', description: 'Generate recycling certificate NFT' }
      ],
      example: 'RecycleCo receives 100 phones, extracts 50g gold, records on blockchain, issues certificates'
    },
    {
      role: 'Regulator',
      color: '#4facfe',
      icon: <TimelineIcon sx={{ fontSize: 60 }} />,
      steps: [
        { step: 1, action: 'Access Dashboard', description: 'View all ecosystem activities' },
        { step: 2, action: 'Monitor Compliance', description: 'Track recycling rates and standards' },
        { step: 3, action: 'Generate Reports', description: 'Create compliance and impact reports' },
        { step: 4, action: 'Audit Trail', description: 'Review complete blockchain history' },
        { step: 5, action: 'Enforce Standards', description: 'Ensure environmental regulations met' }
      ],
      example: 'EPA tracks 1M devices, finds 75% recycling rate, generates quarterly report, identifies violators'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Blockchain-Powered"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mb: 2,
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                E-Waste Recycling Tracking System
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
                Track electronic devices from manufacturing to recycling using blockchain technology
              </Typography>
              <Stack direction="row" spacing={2}>
                {isAuthenticated ? (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      const roleRoutes = {
                        manufacturer: '/manufacturer/dashboard',
                        consumer: '/consumer/dashboard',
                        recycler: '/recycler/dashboard',
                        regulator: '/regulator/dashboard'
                      };
                      navigate(roleRoutes[user?.role] || '/dashboard');
                    }}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: '#f0f0f0'
                      }
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        bgcolor: 'white',
                        color: '#667eea',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          bgcolor: '#f0f0f0'
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        borderColor: 'white',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5} sx={{ textAlign: 'center' }}>
              <RecyclingIcon sx={{ fontSize: 200, opacity: 0.3 }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Why Use Our Platform?
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Blockchain-powered e-waste management for a sustainable future
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* What We Track Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              What We Track
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Comprehensive e-waste lifecycle monitoring
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {trackingCapabilities.map((capability, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    border: '2px solid #667eea20'
                  }}
                >
                  <Typography variant="body1" fontWeight="medium">
                    {capability}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* User Workflows Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            How It Works - User Workflows
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Step-by-step process for each stakeholder
          </Typography>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/examples')}
            sx={{ mt: 2, borderColor: '#667eea', color: '#667eea' }}
          >
            View Detailed Examples
          </Button>
        </Box>

        {workflows.map((workflow, workflowIndex) => (
          <Paper
            key={workflowIndex}
            elevation={3}
            sx={{
              mb: 4,
              p: 4,
              background: `linear-gradient(135deg, ${workflow.color}05 0%, ${workflow.color}15 100%)`,
              border: `2px solid ${workflow.color}40`
            }}
          >
            {/* Workflow Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: workflow.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 3
                }}
              >
                {workflow.icon}
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" sx={{ color: workflow.color }}>
                  {workflow.role} Workflow
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Complete process from start to finish
                </Typography>
              </Box>
            </Box>

            {/* Workflow Steps */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {workflow.steps.map((step, stepIndex) => (
                <Grid item xs={12} md={2.4} key={stepIndex}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      p: 2,
                      textAlign: 'center',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        bgcolor: workflow.color,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}
                    >
                      {step.step}
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {step.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Example */}
            <Paper
              sx={{
                p: 3,
                bgcolor: workflow.color + '10',
                border: `1px solid ${workflow.color}30`
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold" color={workflow.color} gutterBottom>
                Real-World Example:
              </Typography>
              <Typography variant="body1">
                {workflow.example}
              </Typography>
            </Paper>
          </Paper>
        ))}
      </Container>

      {/* Stakeholders Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Who Can Use This?
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Built for all stakeholders in the e-waste ecosystem
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {stakeholders.map((stakeholder, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 8
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: stakeholder.color + '20',
                      color: stakeholder.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px'
                    }}
                  >
                    {stakeholder.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {stakeholder.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stakeholder.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8
          }}
        >
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Ready to Get Started?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                Join the blockchain revolution in e-waste management
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      bgcolor: '#f0f0f0'
                    }
                  }}
                >
                  Register Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ bgcolor: '#2d3748', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center">
            2024 E-Waste Blockchain Tracking System. Powered by Ethereum.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
