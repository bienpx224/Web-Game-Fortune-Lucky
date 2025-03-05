const Wish = require('../models/Wish');

// Controller để lưu lời chúc mới
exports.saveWish = async (req, res) => {
  try {
    const { name, message } = req.body;
    
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Tên và lời chúc không được để trống'
      });
    }

    const wish = await Wish.create({
      name,
      message
    });

    res.status(201).json({
      success: true,
      data: wish
    });
  } catch (error) {
    console.error('Lỗi khi lưu lời chúc:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lưu lời chúc'
    });
  }
};

// Controller để lấy danh sách lời chúc gần đây
exports.getRecentWishes = async (req, res) => {
  try {
    const wishes = await Wish.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name message createdAt');

    res.status(200).json({
      success: true,
      data: wishes
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lời chúc:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy danh sách lời chúc'
    });
  }
}; 