const express = require('express');
const router = express.Router();
const { saveWish, getRecentWishes } = require('../controllers/wishController');

// Route để lưu lời chúc mới
router.post('/wishes', saveWish);

// Route để lấy danh sách lời chúc gần đây
router.get('/wishes/recent', getRecentWishes);

module.exports = router; 