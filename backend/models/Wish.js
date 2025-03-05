const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Tạo index cho createdAt để tối ưu query lấy wishes gần đây
wishSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Wish', wishSchema); 