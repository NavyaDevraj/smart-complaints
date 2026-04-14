const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const ctrl = require('../controllers/complaintController');

router.post('/', protect, upload.single('image'), ctrl.createComplaint);
router.get('/my', protect, ctrl.getMyComplaints);
router.get('/all', protect, adminOnly, ctrl.getAllComplaints);
router.post('/assign', protect, adminOnly, ctrl.assignWorker);
router.post('/status', protect, ctrl.updateStatus);

module.exports = router;