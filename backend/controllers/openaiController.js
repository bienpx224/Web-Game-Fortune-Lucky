/**
 * Controller xử lý logic gọi OpenAI API
 */
const { OpenAI } = require('openai');
const config = require('../config/config');
const Wish = require('../models/Wish');

// Khởi tạo client OpenAI
const openai = new OpenAI({
  apiKey: config.openai.apiKey
});

/**
 * Sanitize dữ liệu người dùng - loại bỏ các từ khóa nguy hiểm
 * @param {string} input - Chuỗi input cần kiểm tra
 * @returns {string} - Chuỗi đã được làm sạch
 */
const sanitizeUserInput = (input) => {
  if (!input) return '';
  
  // Danh sách các từ khóa nguy hiểm cần kiểm tra
  const dangerousKeywords = [
    'javascript:',
    'document',
    'window',
    'innerHTML',
    'outerHTML',
    'insertAdjacentHTML',
    'eval',
    'setTimeout',
    'setInterval',
    'Function(',
    'alert(',
    'confirm(',
    'prompt(',
    'onload',
    'onunload',
    'onclick',
    'ondblclick',
    'onmousedown',
    'onmouseup',
    'onmouseover',
    'onmousemove',
    'onmouseout',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onfocus',
    'onblur',
    'onsubmit',
    'onreset',
    'onselect',
    'onchange',
    '<script',
    '</script',
    '<iframe',
    '</iframe',
    'onerror',
    'fetch(',
    'XMLHttpRequest',
    'alert(',
    'confirm(',
    'prompt(',
    'onload',
    'onunload',
    'onclick',
    'ondblclick',
    'onmousedown',
    'onmouseup',
    'onmouseover',
    'onmousemove',
    'onmouseout',
    'onkeydown',
    
  ];
  
  // Loại bỏ các thẻ HTML
  let sanitized = input;
  
  // Loại bỏ các từ khóa nguy hiểm
  dangerousKeywords.forEach(keyword => {
    // Tìm và xóa từ khóa (không phân biệt hoa thường)
    const regex = new RegExp(keyword, 'gi');
    sanitized = sanitized.replace(regex, '');
  });
  
  // Xóa các thẻ HTML
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  return sanitized;
};

/**
 * Tạo lời chúc dựa trên chủ đề và tên người chơi
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.generateFortune = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    let { fortuneType, playerName } = req.body;
    
    // Validate dữ liệu đầu vào
    if (!fortuneType || !playerName) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin! Cần cung cấp fortuneType và playerName'
      });
    }
    
    // Sanitize tên người chơi để ngăn chặn XSS
    playerName = sanitizeUserInput(playerName);
    
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
          content: "Bạn là trợ lý AI tạo lời chúc và câu thơ cho ngày Quốc tế Phụ nữ 8/3. Hãy luôn kết thúc lời chúc bằng một dòng mới và thêm một số may mắn từ 1-99 ở dòng cuối cùng với định dạng 'Số may mắn của bạn: X'."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: config.openai.temperature,
      max_tokens: config.openai.maxTokens
    });
    
    // Lấy kết quả từ OpenAI
    const fortuneResult = response.choices[0].message.content.trim();
    
    // Trích xuất số may mắn từ kết quả
    let luckyNumber = null;
    let cleanedFortuneResult = fortuneResult;
    
    // Tìm số may mắn bằng regex (tìm "Số may mắn của bạn: X" hoặc các biến thể)
    const luckyNumberMatch = fortuneResult.match(/Số may mắn của bạn:?\s*(\d+)/i);
    if (luckyNumberMatch && luckyNumberMatch[1]) {
      luckyNumber = parseInt(luckyNumberMatch[1]);
      
      // Lấy nội dung lời chúc mà không có dòng số may mắn
      const lines = fortuneResult.split('\n');
      const luckyNumberLineIndex = lines.findIndex(line => line.match(/Số may mắn của bạn/i));
      
      if (luckyNumberLineIndex !== -1) {
        cleanedFortuneResult = lines.slice(0, luckyNumberLineIndex).join('\n').trim();
      }
    }
    
    // Lưu lời chúc vào database
    try {
      await Wish.create({
        name: playerName,
        message: cleanedFortuneResult,
        luckyNumber: luckyNumber
      });
      console.log(`Đã lưu lời chúc của ${playerName} với số may mắn ${luckyNumber} vào database`);
    } catch (dbError) {
      console.error('Lỗi khi lưu vào database:', dbError);
      // Không return lỗi ở đây vì vẫn muốn trả về kết quả cho user
    }
    
    // Log thông tin cho debug
    console.log(`Đã tạo lời chúc cho ${playerName} với chủ đề ${fortuneType}`);
    
    // Trả về kết quả thành công
    return res.status(200).json({
      success: true,
      data: {
        result: fortuneResult,
        fortuneType,
        playerName,
        luckyNumber
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