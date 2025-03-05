/**
 * API Routes
 */
const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');

// Route để tạo lời chúc
router.post('/fortune', openaiController.generateFortune);

// Route kiểm tra trạng thái API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API đang hoạt động bình thường',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 