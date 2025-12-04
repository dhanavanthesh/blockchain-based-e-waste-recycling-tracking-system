const express = require('express');
const router = express.Router();
const {
  getRecyclingDevices,
  updateDeviceStatusByRecycler,
  submitReport,
  getRecyclerReports,
  getReportDetails,
  getStatistics,
  uploadRecyclingPhotos
} = require('../controllers/recyclerController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { upload } = require('../services/fileService');

// Protect all routes
router.use(protect);

// Check recycler role for all routes
router.use(checkRole('recycler'));

// Routes
router.get('/devices', getRecyclingDevices);
router.put('/device/:id/status', updateDeviceStatusByRecycler);
router.post('/report', submitReport);
router.get('/reports', getRecyclerReports);
router.get('/report/:id', getReportDetails);
router.get('/statistics', getStatistics);
router.post('/upload-photos', upload.array('photos', 5), uploadRecyclingPhotos);

module.exports = router;
