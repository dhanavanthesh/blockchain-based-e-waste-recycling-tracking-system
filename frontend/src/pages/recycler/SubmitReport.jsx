import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
  Grid
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { useWeb3 } from '../../contexts/Web3Context';
import api from '../../services/api';

const SubmitReport = () => {
  const { account, contract, isConnected } = useWeb3();
  const [devices, setDevices] = useState([]);
  const [formData, setFormData] = useState({
    deviceId: '',
    weight: '',
    components: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await api.get('/recycler/devices');
      setDevices(response.data.devices);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isConnected || !contract) {
      setError('Please connect your MetaMask wallet');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const device = devices.find(d => d._id === formData.deviceId);
      if (!device) {
        setError('Device not found');
        return;
      }

      // Submit report on blockchain
      const tx = await contract.methods
        .submitRecyclingReport(
          device.blockchainId,
          parseInt(formData.weight),
          formData.components
        )
        .send({ from: account });

      // Get report ID from event
      const reportId = tx.events.RecyclingReportSubmitted.returnValues.reportId;

      // Submit to backend
      await api.post('/recycler/report', {
        deviceId: formData.deviceId,
        blockchainReportId: reportId,
        weight: formData.weight,
        components: formData.components,
        notes: formData.notes,
        transactionHash: tx.transactionHash
      });

      setSuccess('Recycling report submitted successfully!');
      setFormData({ deviceId: '', weight: '', components: '', notes: '' });
      fetchDevices();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Submit Recycling Report
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Report recycling completion for a device
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                select
                label="Select Device"
                value={formData.deviceId}
                onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                disabled={submitting}
              >
                {devices.map((device) => (
                  <MenuItem key={device._id} value={device._id}>
                    {device.specifications?.model} - #{device.blockchainId}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Weight (grams)"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Components Recovered"
                value={formData.components}
                onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                placeholder="e.g., Gold, Copper, Plastic"
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                disabled={submitting || !isConnected}
              >
                {submitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default SubmitReport;
