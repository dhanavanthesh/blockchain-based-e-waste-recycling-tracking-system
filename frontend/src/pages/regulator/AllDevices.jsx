import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Stack
} from '@mui/material';
import DeviceCard from '../../components/device/DeviceCard';
import api from '../../services/api';

const AllDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDevices();
  }, [statusFilter]);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await api.get('/regulator/devices', { params });
      setDevices(response.data.devices);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
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
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <div>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              All Devices
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              System-wide device monitoring
            </Typography>
          </div>
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="manufactured">Manufactured</MenuItem>
            <MenuItem value="in_use">In Use</MenuItem>
            <MenuItem value="in_recycling">In Recycling</MenuItem>
            <MenuItem value="recycled">Recycled</MenuItem>
          </TextField>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Alert severity="info" sx={{ mb: 3 }}>
        Total Devices: {devices.length}
      </Alert>

      {devices.length === 0 ? (
        <Alert severity="info">No devices found</Alert>
      ) : (
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device._id}>
              <DeviceCard device={device} showActions={false} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AllDevices;
