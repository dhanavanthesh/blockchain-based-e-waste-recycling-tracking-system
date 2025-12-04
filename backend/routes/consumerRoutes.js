const express = require('express');
const router = express.Router();
const {
  scanDevice,
  claimDevice,
  getMyDevices,
  getDeviceDetails,
  recycleDevice,
  getStatistics
} = require('../controllers/consumerController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Protect all routes
router.use(protect);

// Check consumer role for all routes
router.use(checkRole('consumer'));

// Routes
router.get('/scan/:blockchainId', scanDevice);
router.post('/claim-device', claimDevice);
router.get('/devices', getMyDevices);
router.get('/device/:id', getDeviceDetails);
router.post('/recycle-device', recycleDevice);
router.get('/statistics', getStatistics);

module.exports = router;
