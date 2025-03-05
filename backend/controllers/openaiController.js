/**
 * Controller xử lý logic gọi OpenAI API
 */
const { OpenAI } = require('openai');
const config = require('../config/config');

// Khởi tạo client OpenAI
const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

/**
 * Tạo lời chúc dựa trên chủ đề và tên người chơi
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.generateFortune = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { fortuneType, playerName } = req.body;
    
    // Validate dữ liệu đầu vào
    if (!fortuneType || !playerName) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin! Cần cung cấp fortuneType và playerName'
      });
    }
    
    // Chuẩn bị prompt bằng cách thay thế các biến trong template
    const prompt = config.promptTemplate
      .replace('{fortuneType}', fortuneType)
      .replace('{playerName}', playerName);
    
    // Kiểm tra API key
    if (!config.openai.apiKey) {
      return res.status(500).json({
        success: false,
        message: 'API key OpenAI chưa được cấu hình!'
      });
    }
    
    // Gọi API OpenAI
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: "system",
          content: "Bạn là trợ lý AI tạo lời chúc và câu thơ cho ngày Quốc tế Phụ nữ 8/3."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });
    
    // Trả về kết quả
    const fortuneResult = response.choices[0].message.content.trim();
    
    // Log thông tin cho debug
    console.log(`Đã tạo lời chúc cho ${playerName} với chủ đề ${fortuneType}`);
    
    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      data: {
        result: fortuneResult,
        fortuneType,
        playerName
      }
    });
    
  } catch (error) {
    console.error('Lỗi khi gọi OpenAI API:', error);
    
    // Trả về thông báo lỗi
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo lời chúc',
      error: error.message
    });
  }
}; 