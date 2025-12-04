import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

const QRDisplay = ({ open, onClose, qrCode, deviceInfo }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `device-${deviceInfo?.blockchainId || 'qrcode'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Device QR Code
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={3}
        >
          {qrCode && (
            <>
              <Box
                component="img"
                src={qrCode}
                alt="Device QR Code"
                sx={{
                  width: '100%',
                  maxWidth: 300,
                  height: 'auto',
                  border: '2px solid #e0e0e0',
                  borderRadius: 2,
                  p: 2,
                  bgcolor: 'white'
                }}
              />
              {deviceInfo && (
                <Box mt={3} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    <strong>Blockchain ID:</strong> {deviceInfo.blockchainId}
                  </Typography>
                  {deviceInfo.serialNumber && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Serial Number:</strong> {deviceInfo.serialNumber}
                    </Typography>
                  )}
                  {deviceInfo.model && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Model:</strong> {deviceInfo.model}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          onClick={handleDownload}
          variant="contained"
          startIcon={<DownloadIcon />}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRDisplay;
