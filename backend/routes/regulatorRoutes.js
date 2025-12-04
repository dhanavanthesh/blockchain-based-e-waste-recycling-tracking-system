const express = require('express');
const router = express.Router();
const {
  getAllDevices,
  getAllReports,
  verifyRecyclingReport,
  getSystemStatistics,
  getDeviceCompliance,
  getManufacturers,
  getRecyclers
} = require('../controllers/regulatorController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// Protect all routes
router.use(protect);

// Check regulator role for all routes
router.use(checkRole('regulator'));

// Routes
router.get('/devices', getAllDevices);
router.get('/reports', getAllReports);
router.put('/report/:id/verify', verifyRecyclingReport);
router.get('/statistics', getSystemStatistics);
router.get('/device/:id', getDeviceCompliance);
router.get('/manufacturers', getManufacturers);
router.get('/recyclers', getRecyclers);

module.exports = router;
