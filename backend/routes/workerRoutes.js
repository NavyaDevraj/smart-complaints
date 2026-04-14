const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAvailableWorkers, getMyAssignedComplaints } = require('../controllers/workerController');

router.get('/available', protect, getAvailableWorkers);
router.get('/my-complaints', protect, getMyAssignedComplaints);

module.exports = router;