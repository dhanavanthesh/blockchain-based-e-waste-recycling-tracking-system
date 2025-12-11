import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { truncateAddress } from '../../utils/dummyBlockchain';
import { useWeb3 } from '../../contexts/DummyWalletContext';

const FakeMetaMaskConnectModal = () => {
  const { showConnectModal, handleConnectConfirm, handleConnectReject, account } = useWeb3();
  const [connecting, setConnecting] = React.useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await handleConnectConfirm();
    setConnecting(false);
  };

  return (
    <Dialog
      open={showConnectModal}
      onClose={handleConnectReject}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Typography variant="h4">🦊</Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold">
            Connect Wallet
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
            Connect to E-Waste Tracking Application
          </Typography>

          {connecting && (
            <Box sx={{ mb: 3 }}>
              <CircularProgress size={24} sx={{ color: 'white' }} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Connecting...
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleConnectReject}
              disabled={connecting}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConnect}
              disabled={connecting}
              sx={{
                background: 'white',
                color: '#667eea',
                fontWeight: 'bold',
                '&:hover': {
                  background: '#f0f0f0'
                }
              }}
            >
              Connect
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default FakeMetaMaskConnectModal;
