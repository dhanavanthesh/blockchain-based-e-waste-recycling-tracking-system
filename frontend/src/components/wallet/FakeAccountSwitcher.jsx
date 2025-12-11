import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import { Add as AddIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { truncateAddress, loadDummyWallets, createDummyWallet } from '../../utils/dummyBlockchain';
import { useWeb3 } from '../../contexts/DummyWalletContext';

const FakeAccountSwitcher = () => {
  const { showAccountSwitcher, handleSwitchAccount, account } = useWeb3();
  const [wallets, setWallets] = React.useState([]);

  React.useEffect(() => {
    if (showAccountSwitcher) {
      setWallets(loadDummyWallets());
    }
  }, [showAccountSwitcher]);

  const handleClose = () => {
    handleSwitchAccount(account); // Close without changing
  };

  const handleCreateNew = () => {
    const newWallet = createDummyWallet();
    setWallets([...wallets, newWallet]);
    handleSwitchAccount(newWallet.address);
  };

  return (
    <Dialog
      open={showAccountSwitcher}
      onClose={handleClose}
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
        <Typography variant="h6" fontWeight="bold">
          Select Account
        </Typography>
      </DialogTitle>

      <DialogContent>
        <List sx={{ py: 0 }}>
          {wallets.map((wallet, index) => (
            <React.Fragment key={wallet.address}>
              {index > 0 && <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />}
              <ListItemButton
                onClick={() => handleSwitchAccount(wallet.address)}
                selected={wallet.address === account}
                sx={{
                  borderRadius: 1,
                  my: 0.5,
                  '&.Mui-selected': {
                    background: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.25)'
                    }
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={wallet.address === account ? 'bold' : 'normal'}>
                        {wallet.alias}
                      </Typography>
                      {wallet.address === account && (
                        <CheckCircleIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ opacity: 0.8, color: 'white' }}>
                      {truncateAddress(wallet.address)}
                    </Typography>
                  }
                />
              </ListItemButton>
            </React.Fragment>
          ))}
        </List>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{
            mt: 2,
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              background: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Create New Account
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={handleClose}
          sx={{
            mt: 1,
            color: 'white',
            '&:hover': {
              background: 'rgba(255,255,255,0.1)'
            }
          }}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default FakeAccountSwitcher;
