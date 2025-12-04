import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { QrCodeScanner as QrCodeScannerIcon } from '@mui/icons-material';

const QRScanner = ({ open, onClose, onScan }) => {
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');

  const handleManualSubmit = () => {
    if (!manualInput.trim()) {
      setError('Please enter a blockchain ID');
      return;
    }

    const blockchainId = parseInt(manualInput.trim());
    if (isNaN(blockchainId)) {
      setError('Please enter a valid numeric blockchain ID');
      return;
    }

    onScan(blockchainId);
    setManualInput('');
    setError('');
  };

  const handleClose = () => {
    setManualInput('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <QrCodeScannerIcon color="primary" />
          <Typography variant="h6">Scan Device QR Code</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box py={2}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Enter the Blockchain ID from the device QR code
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Blockchain ID"
            placeholder="Enter device blockchain ID (e.g., 1, 2, 3...)"
            value={manualInput}
            onChange={(e) => {
              setManualInput(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleManualSubmit();
              }
            }}
            type="number"
            autoFocus
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            You can find the Blockchain ID on the device QR code label
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleManualSubmit} variant="contained" color="primary">
          Scan Device
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRScanner;
