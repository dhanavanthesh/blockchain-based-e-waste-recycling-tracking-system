import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import { SocketProvider } from './contexts/SocketContext';

import Navigation from './components/common/Navigation';
import PrivateRoute from './components/common/PrivateRoute';
import Home from './pages/Home';
import Examples from './pages/Examples';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ManufacturerDashboard from './pages/manufacturer/Dashboard';
import ManufacturerRegisterWallet from './pages/manufacturer/RegisterWallet';
import AddDevice from './pages/manufacturer/AddDevice';
import DeviceList from './pages/manufacturer/DeviceList';
import ConsumerDashboard from './pages/consumer/Dashboard';
import ConsumerDevicesList from './pages/consumer/DevicesList';
import ConsumerRegisterWallet from './pages/consumer/RegisterWallet';
import RecyclerDashboard from './pages/recycler/Dashboard';
import RecyclerDevicesList from './pages/recycler/DevicesList';
import RecyclerSubmitReport from './pages/recycler/SubmitReport';
import RecyclerRegisterWallet from './pages/recycler/RegisterWallet';
import RegulatorDashboard from './pages/regulator/Dashboard';
import RegulatorAllDevices from './pages/regulator/AllDevices';
import RegulatorReportsList from './pages/regulator/ReportsList';
import RegulatorRegisterWallet from './pages/regulator/RegisterWallet';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Web3Provider>
          <SocketProvider>
            <BrowserRouter>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navigation />
                <Box sx={{ flexGrow: 1 }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/examples" element={<Examples />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Manufacturer Routes */}
                    <Route
                      path="/manufacturer/dashboard"
                      element={
                        <PrivateRoute role="manufacturer">
                          <ManufacturerDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/manufacturer/add-device"
                      element={
                        <PrivateRoute role="manufacturer">
                          <AddDevice />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/manufacturer/devices"
                      element={
                        <PrivateRoute role="manufacturer">
                          <DeviceList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/manufacturer/register-wallet"
                      element={
                        <PrivateRoute role="manufacturer">
                          <ManufacturerRegisterWallet />
                        </PrivateRoute>
                      }
                    />

                    {/* Consumer Routes */}
                    <Route
                      path="/consumer/dashboard"
                      element={
                        <PrivateRoute role="consumer">
                          <ConsumerDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/consumer/devices"
                      element={
                        <PrivateRoute role="consumer">
                          <ConsumerDevicesList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/consumer/register-wallet"
                      element={
                        <PrivateRoute role="consumer">
                          <ConsumerRegisterWallet />
                        </PrivateRoute>
                      }
                    />

                    {/* Recycler Routes */}
                    <Route
                      path="/recycler/dashboard"
                      element={
                        <PrivateRoute role="recycler">
                          <RecyclerDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/recycler/devices"
                      element={
                        <PrivateRoute role="recycler">
                          <RecyclerDevicesList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/recycler/submit-report"
                      element={
                        <PrivateRoute role="recycler">
                          <RecyclerSubmitReport />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/recycler/register-wallet"
                      element={
                        <PrivateRoute role="recycler">
                          <RecyclerRegisterWallet />
                        </PrivateRoute>
                      }
                    />

                    {/* Regulator Routes */}
                    <Route
                      path="/regulator/dashboard"
                      element={
                        <PrivateRoute role="regulator">
                          <RegulatorDashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/regulator/devices"
                      element={
                        <PrivateRoute role="regulator">
                          <RegulatorAllDevices />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/regulator/reports"
                      element={
                        <PrivateRoute role="regulator">
                          <RegulatorReportsList />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/regulator/register-wallet"
                      element={
                        <PrivateRoute role="regulator">
                          <RegulatorRegisterWallet />
                        </PrivateRoute>
                      }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </Box>
              </Box>
            </BrowserRouter>
          </SocketProvider>
        </Web3Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
