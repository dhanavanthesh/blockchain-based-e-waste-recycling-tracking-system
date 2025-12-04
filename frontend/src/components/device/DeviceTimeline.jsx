import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { Typography, Paper, Box } from '@mui/material';
import {
  Build as BuildIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Recycling as RecyclingIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const DeviceTimeline = ({ device }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimelineEvents = () => {
    const events = [];

    // Manufacturing event
    events.push({
      title: 'Manufactured',
      description: `Device created by ${device.manufacturerId?.name || 'Unknown'}`,
      date: device.createdAt,
      icon: <BuildIcon />,
      color: 'primary'
    });

    // Ownership transfers
    if (device.ownershipHistory && device.ownershipHistory.length > 0) {
      device.ownershipHistory.forEach((ownership, index) => {
        const ownerRole = ownership.ownerId?.role;
        let icon = <PersonIcon />;
        let color = 'secondary';

        if (ownerRole === 'consumer') {
          icon = <ShoppingCartIcon />;
          color = 'success';
        } else if (ownerRole === 'recycler') {
          icon = <RecyclingIcon />;
          color = 'warning';
        }

        events.push({
          title: `Transferred to ${ownerRole || 'User'}`,
          description: ownership.ownerId?.name || 'Unknown User',
          date: ownership.transferDate,
          icon,
          color
        });
      });
    }

    // Recycled event
    if (device.status === 'recycled' && device.recyclingReportId) {
      events.push({
        title: 'Recycled',
        description: 'Device successfully recycled',
        date: device.updatedAt,
        icon: <CheckCircleIcon />,
        color: 'success'
      });
    }

    return events;
  };

  const events = getTimelineEvents();

  return (
    <Timeline position="right">
      {events.map((event, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            {formatDate(event.date)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color={event.color}>
              {event.icon}
            </TimelineDot>
            {index < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" component="span" fontWeight="bold">
                {event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {event.description}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default DeviceTimeline;
