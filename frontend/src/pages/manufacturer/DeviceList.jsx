import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  QrCode as QrCodeIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import api from '../../services/api';

const DeviceList = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    manufactured: 0,
    inUse: 0
  });

  useEffect(() => {
    fetchDevices();

    // Listen for real-time updates
    if (socket) {
      socket.on('device:registered', () => {
        fetchDevices();
      });

      socket.on('device:transferred', () => {
        fetchDevices();
      });

      socket.on('device:statusUpdated', () => {
        fetchDevices();
      });
    }

    return () => {
      if (socket) {
        socket.off('device:registered');
        socket.off('device:transferred');
        socket.off('device:statusUpdated');
      }
    };
  }, [socket]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/manufacturer/devices');

      if (response.data.success) {
        setDevices(response.data.devices);

        // Calculate stats
        setStats({
          total: response.data.devices.length,
          manufactured: response.data.devices.filter(d => !d.currentOwnerId || d.currentOwnerId._id === d.manufacturerId._id).length,
          inUse: response.data.devices.filter(d => d.currentOwnerId && d.currentOwnerId._id !== d.manufacturerId._id).length
        });
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
      setError('Failed to load devices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewQR = (qrCode) => {
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>Device QR Code</title></head>
        <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5;">
          <div style="text-align: center; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="margin-bottom: 20px;">Device QR Code</h2>
            <img src="${qrCode}" alt="QR Code" style="max-width: 400px;" />
            <p style="margin-top: 20px; color: #666;">Scan this QR code to track the device</p>
          </div>
        </body>
      </html>
    `);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/manufacturer/dashboard')}
          >
            Back to Dashboard
          </Button>

          <Box display="flex" gap={2}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchDevices} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/manufacturer/add-device')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            >
              Add New Device
            </Button>
          </Box>
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Devices
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Manage all your registered electronic devices
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Devices
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="primary.main">
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  In Stock
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  {stats.manufactured}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Sold/In Use
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="success.main">
                  {stats.inUse}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Devices Table */}
        <Paper elevation={2}>
          {devices.length === 0 ? (
            <Box p={6} textAlign="center">
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No devices registered yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start by registering your first electronic device on the blockchain
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/manufacturer/add-device')}
              >
                Register First Device
              </Button>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Blockchain ID</strong></TableCell>
                    <TableCell><strong>Device Name</strong></TableCell>
                    <TableCell><strong>Model</strong></TableCell>
                    <TableCell><strong>Serial Number</strong></TableCell>
                    <TableCell><strong>Category</strong></TableCell>
                    <TableCell><strong>Current Owner</strong></TableCell>
                    <TableCell><strong>Registered</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device._id} hover>
                      <TableCell>
                        <Chip
                          label={`#${device.blockchainId}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {device.specifications.category}
                        </Typography>
                      </TableCell>
                      <TableCell>{device.specifications.model}</TableCell>
                      <TableCell>
                        <Typography variant="caption" fontFamily="monospace">
                          {device.specifications.serialNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={device.specifications.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {device.currentOwnerId ? (
                          <Box>
                            <Typography variant="body2">
                              {device.currentOwnerId.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {device.currentOwnerId.email}
                            </Typography>
                          </Box>
                        ) : (
                          <Chip label="Manufacturer" size="small" color="info" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {formatDate(device.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View QR Code">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewQR(device.qrCode)}
                            disabled={!device.qrCode}
                          >
                            <QrCodeIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => navigate(`/manufacturer/device/${device._id}`)}
                          >
                            <InfoIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default DeviceList;
