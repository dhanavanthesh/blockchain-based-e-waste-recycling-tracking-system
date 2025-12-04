import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  Info as InfoIcon,
  Devices as DevicesIcon
} from '@mui/icons-material';
import StatusBadge from './StatusBadge';

const DeviceCard = ({ device, onViewDetails, onScanQR, showActions = true }) => {
  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DevicesIcon color="primary" />
            <Typography variant="h6" component="div" fontWeight="bold">
              {device.specifications?.model || 'Unknown Model'}
            </Typography>
          </Box>
          <StatusBadge status={device.status} />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Serial Number:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            {device.specifications?.serialNumber || 'N/A'}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            <strong>Category:</strong>
          </Typography>
          <Chip
            label={device.specifications?.category || 'Unknown'}
            size="small"
            variant="outlined"
          />
        </Box>

        {device.manufacturerId && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Manufacturer:</strong>
            </Typography>
            <Typography variant="body2">
              {device.manufacturerId.name || 'Unknown'}
            </Typography>
          </Box>
        )}

        <Box mb={1}>
          <Typography variant="caption" color="text.secondary">
            Blockchain ID: #{device.blockchainId}
          </Typography>
        </Box>

        {device.specifications?.weight > 0 && (
          <Box>
            <Typography variant="caption" color="text.secondary">
              Weight: {device.specifications.weight}g
            </Typography>
          </Box>
        )}
      </CardContent>

      {showActions && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Stack direction="row" spacing={1} width="100%">
            {onViewDetails && (
              <Button
                size="small"
                variant="contained"
                startIcon={<InfoIcon />}
                onClick={() => onViewDetails(device)}
                fullWidth
              >
                Details
              </Button>
            )}
            {onScanQR && device.qrCode && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => onScanQR(device)}
                fullWidth
              >
                QR Code
              </Button>
            )}
          </Stack>
        </CardActions>
      )}
    </Card>
  );
};

export default DeviceCard;
