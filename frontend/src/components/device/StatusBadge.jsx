import React from 'react';
import { Chip } from '@mui/material';
import {
  CheckCircle,
  Pending,
  Recycling,
  LocalShipping,
  Build
} from '@mui/icons-material';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'manufactured':
        return {
          label: 'Manufactured',
          color: 'primary',
          icon: <Build fontSize="small" />
        };
      case 'in_use':
        return {
          label: 'In Use',
          color: 'success',
          icon: <CheckCircle fontSize="small" />
        };
      case 'in_recycling':
        return {
          label: 'In Recycling',
          color: 'warning',
          icon: <LocalShipping fontSize="small" />
        };
      case 'collected':
        return {
          label: 'Collected',
          color: 'info',
          icon: <Pending fontSize="small" />
        };
      case 'recycled':
        return {
          label: 'Recycled',
          color: 'success',
          icon: <Recycling fontSize="small" />
        };
      default:
        return {
          label: status || 'Unknown',
          color: 'default',
          icon: null
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={config.icon}
      sx={{ fontWeight: 'medium' }}
    />
  );
};

export default StatusBadge;
