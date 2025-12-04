import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useWeb3 } from '../../contexts/Web3Context';
import api from '../../services/api';

const ReportsList = () => {
  const { account, contract, isConnected } = useWeb3();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/regulator/reports');
      setReports(response.data.reports);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isConnected || !contract || !selectedReport) return;

    try {
      setVerifying(true);
      setError('');

      // Verify on blockchain
      const tx = await contract.methods
        .verifyReport(selectedReport.blockchainReportId)
        .send({ from: account });

      // Update in backend
      await api.put(`/regulator/report/${selectedReport._id}/verify`, {
        transactionHash: tx.transactionHash
      });

      setVerifyDialog(false);
      fetchReports();
      alert('Report verified successfully!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to verify report');
    } finally {
      setVerifying(false);
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
          Recycling Reports
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Verify and monitor recycling reports
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Report ID</strong></TableCell>
              <TableCell><strong>Device</strong></TableCell>
              <TableCell><strong>Recycler</strong></TableCell>
              <TableCell><strong>Weight (g)</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report._id}>
                <TableCell>#{report.blockchainReportId}</TableCell>
                <TableCell>{report.deviceId?.specifications?.model || 'N/A'}</TableCell>
                <TableCell>{report.recyclerId?.name || 'N/A'}</TableCell>
                <TableCell>{report.weight}</TableCell>
                <TableCell>
                  {report.verified ? (
                    <Chip label="Verified" color="success" size="small" />
                  ) : (
                    <Chip label="Pending" color="warning" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {!report.verified && (
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => {
                        setSelectedReport(report);
                        setVerifyDialog(true);
                      }}
                    >
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={verifyDialog} onClose={() => !verifying && setVerifyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Verify Recycling Report</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box py={2}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Are you sure you want to verify this recycling report?
              </Alert>
              <Typography variant="body2">
                <strong>Report ID:</strong> #{selectedReport.blockchainReportId}
              </Typography>
              <Typography variant="body2">
                <strong>Weight:</strong> {selectedReport.weight}g
              </Typography>
              <Typography variant="body2">
                <strong>Components:</strong> {selectedReport.components}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialog(false)} disabled={verifying}>
            Cancel
          </Button>
          <Button onClick={handleVerify} variant="contained" color="success" disabled={verifying}>
            {verifying ? 'Verifying...' : 'Verify Report'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsList;
