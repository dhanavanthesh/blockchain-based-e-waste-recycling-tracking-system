const express = require('express');
const {
  registerDevice,
  saveDeviceMetadata,
  getManufacturerDevices,
  getDeviceDetails,
  getStatistics
} = require('../controllers/manufacturerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);
router.use(authorize('manufacturer'));

router.post('/device', registerDevice);
router.post('/device/metadata', saveDeviceMetadata);
router.get('/devices', getManufacturerDevices);
router.get('/device/:id', getDeviceDetails);
router.get('/statistics', getStatistics);

module.exports = router;
