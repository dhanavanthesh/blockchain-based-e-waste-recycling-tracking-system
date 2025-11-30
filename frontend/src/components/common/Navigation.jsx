import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Recycling as RecyclingIcon,
  AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWeb3 } from '../../contexts/Web3Context';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { account, isConnected } = useWeb3();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleDashboard = () => {
    const roleRoutes = {
      manufacturer: '/manufacturer/dashboard',
      consumer: '/consumer/dashboard',
      recycler: '/recycler/dashboard',
      regulator: '/regulator/dashboard'
    };
    navigate(roleRoutes[user?.role] || '/');
    handleMenuClose();
    setMobileDrawerOpen(false);
  };

  const handleHome = () => {
    navigate('/');
    setMobileDrawerOpen(false);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      manufacturer: '#667eea',
      consumer: '#764ba2',
      recycler: '#f093fb',
      regulator: '#4facfe'
    };
    return colors[role] || '#667eea';
  };

  const handleExamples = () => {
    navigate('/examples');
    setMobileDrawerOpen(false);
  };

  const menuItems = [
    { label: 'Home', icon: <HomeIcon />, action: handleHome },
    { label: 'Examples', icon: <RecyclingIcon />, action: handleExamples },
    ...(isAuthenticated
      ? [{ label: 'Dashboard', icon: <DashboardIcon />, action: handleDashboard }]
      : [])
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: 'white',
          color: 'text.primary'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                flexGrow: { xs: 1, md: 0 }
              }}
              onClick={() => navigate('/')}
            >
              <RecyclingIcon
                sx={{
                  fontSize: 32,
                  mr: 1,
                  color: '#667eea'
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                  }}
                >
                  E-Waste Tracker
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.65rem'
                  }}
                >
                  Blockchain Powered
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                <Button
                  color="inherit"
                  onClick={handleHome}
                  sx={{
                    mx: 1,
                    fontWeight: location.pathname === '/' ? 'bold' : 'normal'
                  }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  onClick={handleExamples}
                  sx={{
                    mx: 1,
                    fontWeight: location.pathname === '/examples' ? 'bold' : 'normal'
                  }}
                >
                  Examples
                </Button>
                {isAuthenticated && (
                  <Button
                    color="inherit"
                    onClick={handleDashboard}
                    sx={{
                      mx: 1,
                      fontWeight: location.pathname.includes('dashboard')
                        ? 'bold'
                        : 'normal'
                    }}
                  >
                    Dashboard
                  </Button>
                )}
              </Box>
            )}

            {/* Right Side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Wallet Status */}
              {isAuthenticated && (
                <Chip
                  icon={<WalletIcon />}
                  label={
                    isConnected
                      ? `${account?.substring(0, 6)}...${account?.substring(38)}`
                      : 'Not Connected'
                  }
                  size="small"
                  color={isConnected ? 'success' : 'default'}
                  sx={{ display: { xs: 'none', sm: 'flex' } }}
                />
              )}

              {/* User Menu */}
              {isAuthenticated ? (
                <>
                  {!isMobile && (
                    <Chip
                      label={user?.role?.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: getRoleBadgeColor(user?.role) + '20',
                        color: getRoleBadgeColor(user?.role),
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                  <IconButton onClick={handleMenuOpen} size="small">
                    <Avatar
                      sx={{
                        bgcolor: getRoleBadgeColor(user?.role),
                        width: 32,
                        height: 32
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem disabled>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user?.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem onClick={handleDashboard}>
                      <DashboardIcon sx={{ mr: 1 }} fontSize="small" />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {isMobile ? (
                    <IconButton
                      edge="end"
                      onClick={() => setMobileDrawerOpen(true)}
                    >
                      <MenuIcon />
                    </IconButton>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/login')}
                        sx={{ borderColor: '#667eea', color: '#667eea' }}
                      >
                        Login
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/register')}
                        sx={{
                          background:
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }}
                      >
                        Register
                      </Button>
                    </>
                  )}
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.label} onClick={item.action}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
            {!isAuthenticated && (
              <>
                <ListItem button onClick={() => navigate('/login')}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button onClick={() => navigate('/register')}>
                  <ListItemIcon>
                    <AccountCircleIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;
