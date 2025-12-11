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
  MenuItem
} from '@mui/material';
import { useWeb3 } from '../../contexts/DummyWalletContext';
import DeviceCard from '../../components/device/DeviceCard';
import api from '../../services/api';

const DevicesList = () => {
  const { account, isConnected } = useWeb3();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [statusDialog, setStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recycler/devices');
      setDevices(response.data.devices);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!isConnected || !selectedDevice) return;

    try {
      setUpdating(true);
      setError('');

      // Update in backend (blockchain update happens in backend via dummy service)
      await api.put(`/recycler/device/${selectedDevice._id}/status`, {
        status: newStatus,
        walletAddress: account
      });

      setStatusDialog(false);
      fetchDevices();
      alert('Device status updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status');
    } finally {
      setUpdating(false);
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
          Recycling Devices
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage devices in recycling process
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {devices.length === 0 ? (
        <Alert severity="info">No devices currently in recycling process</Alert>
      ) : (
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device._id}>
              <DeviceCard device={device} showActions={false} />
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setSelectedDevice(device);
                  setStatusDialog(true);
                }}
                sx={{ mt: 1 }}
              >
                Update Status
              </Button>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={statusDialog} onClose={() => !updating && setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Device Status</DialogTitle>
        <DialogContent>
          <Box py={2}>
            <TextField
              fullWidth
              select
              label="New Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              disabled={updating}
            >
              <MenuItem value="collected">Collected</MenuItem>
              <MenuItem value="in_recycling">In Recycling</MenuItem>
              <MenuItem value="recycled">Recycled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)} disabled={updating}>
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} variant="contained" disabled={!newStatus || updating}>
            {updating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DevicesList;
