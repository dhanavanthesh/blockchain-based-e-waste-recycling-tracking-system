import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  CircularProgress,
  Divider,
  Alert
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useWeb3 } from '../../contexts/DummyWalletContext';

const FakeTransactionModal = () => {
  const {
    showTransactionModal,
    transactionState,
    currentTransaction,
    transactionError,
    handleTransactionConfirm,
    handleTransactionReject,
    retryTransaction
  } = useWeb3();

  if (!currentTransaction) return null;

  const { type, details, gasEstimation } = currentTransaction;

  const renderContent = () => {
    switch (transactionState) {
      case 'pending':
        return (
          <>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Confirm this transaction in your wallet
            </Typography>

            <Box sx={{ my: 3, p: 2, background: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Transaction Details:
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>{type}</strong>
              </Typography>
              {Object.keys(details).map((key) => (
                <Typography key={key} variant="caption" display="block" sx={{ mt: 0.5 }}>
                  {key}: {typeof details[key] === 'object' ? JSON.stringify(details[key]) : String(details[key])}
                </Typography>
              ))}
            </Box>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Estimated Gas:
              </Typography>
              <Typography variant="body2">
                Gas Limit: {gasEstimation.gasLimit}
              </Typography>
              <Typography variant="body2">
                Gas Price: {gasEstimation.gasPrice}
              </Typography>
              <Typography variant="body2">
                Max Fee: {gasEstimation.maxFee} ({gasEstimation.estimatedUSD})
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleTransactionReject}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                onClick={handleTransactionConfirm}
                sx={{
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: '#f0f0f0'
                  }
                }}
              >
                Confirm
              </Button>
            </Box>
          </>
        );

      case 'processing':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ color: 'white', mb: 3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Processing Transaction...
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Please wait while your transaction is being processed
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Transaction Successful!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Your transaction has been confirmed
            </Typography>
          </Box>
        );

      case 'failed':
        return (
          <Box sx={{ py: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <ErrorIcon sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Transaction Failed
              </Typography>
            </Box>

            <Alert severity="error" sx={{ mb: 3 }}>
              {transactionError || 'An error occurred while processing the transaction'}
            </Alert>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={handleTransactionReject}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={retryTransaction}
                sx={{
                  background: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: '#f0f0f0'
                  }
                }}
              >
                Retry
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={showTransactionModal}
      onClose={transactionState === 'pending' || transactionState === 'failed' ? handleTransactionReject : undefined}
      maxWidth="sm"
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
            {type}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
};

export default FakeTransactionModal;
