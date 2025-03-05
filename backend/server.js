/**
 * Server chính cho backend API của Game Gieo Quẻ May Mắn
 */
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const apiRoutes = require('./routes/api');
const wishRoutes = require('./routes/wishRoutes');

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối MongoDB
mongoose.connect(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Đã kết nối thành công với MongoDB'))
.catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Middleware
app.use(cors()); // Cho phép CORS để frontend có thể gọi API
app.use(express.json()); // Phân tích request body dạng JSON

// Log middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/api', wishRoutes);

// Route mặc định
app.get('/', (req, res) => {
  res.json({
    message: 'API Backend cho Game Gieo Quẻ May Mắn - Ngày 8/3',
    docs: 'Sử dụng /api/fortune để tạo lời chúc'
  });
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint không tồn tại'
  });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi server',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Kiểm tra nếu chạy trực tiếp (không phải qua serverless)
if (process.env.NODE_ENV !== 'production') {
  const PORT = config.port || 5001;
  
  // Khởi động server
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    
    // Kiểm tra API key
    if (!config.openai.apiKey) {
      console.warn('CẢNH BÁO: API key OpenAI chưa được cấu hình! Hãy kiểm tra file .env');
    }
  });
}

// Export cho Vercel Serverless Functions
module.exports = app; 