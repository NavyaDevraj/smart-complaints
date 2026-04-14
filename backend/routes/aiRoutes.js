const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { analyzeComplaint, chatbot } = require('../controllers/aiController');

router.post('/analyze', protect, analyzeComplaint);
router.post('/chatbot', protect, chatbot);

module.exports = router;