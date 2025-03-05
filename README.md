# Dự án Game Code for Her Nhân ngày 8/3

## Mục tiêu : 
- Dự án là 1 web game kiểu gieo quẻ, bói toán. Để từ thẻ bói đó, người chơi sẽ nhận được 1 câu đối, câu thơ, 1 câu joke of the day, câu khen hài hước, ... đại loại như thế để gửi tới người chơi nhân ngày 8/3. Nội dung phản hồi sẽ được lấy từ openAI thông qua việc call API của openAI. 

## Luồng hoạt động : 
- Khi Người chơi vào web sẽ hiển thị yêu cầu người chơi nhập Tên 
- Màn hình chính hiển thị ra ô lắc hoặc xúc sắc để gieo quẻ, gieo số. 
- Có nút Ấn Rút quẻ may mắn, thực hiện animation vui nhộn gì đó, sau đó hệ thống sẽ ngẫu nhiên trả về 1 trong danh sách 10 quẻ (mỗi quẻ sẽ là 1 key, và key đó là từ khoá chính của nội dung mà sẽ phản hồi về, Ví dụ : Sức khoẻ, sắc đẹp, gia đình, niềm vui, tình yêu, ... )
- Khi thực hiện Rút được quẻ xong, web sẽ dựa vào kết quả quẻ đó, cùng với promt để gửi lên openAI lấy về phản hồi cho người dùng. 
- Lưu ý : Promt sẽ có nội dung để openAI hiểu được mục đích dự án, dựa vào Key chủ đề truyền lên, Tên Người dùng và trả về phản hồi là lời chúc, câu thơ, lời phán, nhận xét mang tính tích cực, vui nhộn, hài hước hoặc sâu lắng, để mỗi người dùng sẽ có được 1 kết quả riêng mang tính đặc trưng, thích thú. 
- Sau khi nhận được phản hồi thì hệ thống sẽ hiển thị Lời chúc đó ra 1 cách trông nhẹ nhàng, đẹp mắt. 

## Hướng dẫn cài đặt và sử dụng

### Cài đặt Frontend
1. Clone dự án về máy:
```
git clone [địa chỉ repo]
cd game-lucky
```

2. Thay file ảnh nền `img/bg-pattern.png` bằng một hình nền thực tế phù hợp.

### Cài đặt Backend

1. Cài đặt các dependencies cho backend:
```
cd backend
npm install
```

2. Cấu hình biến môi trường:
   - Tạo hoặc chỉnh sửa file `.env` trong thư mục `backend`
   - Thêm API key OpenAI của bạn:
   ```
   PORT=5001
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   OPENAI_MAX_TOKENS=200
   OPENAI_TEMPERATURE=0.7
   ```

### Chạy ứng dụng

1. Khởi động Backend:
```
cd backend
npm run dev  # Dùng nodemon để khởi động với chế độ auto-reload
```
hoặc
```
cd backend
npm start  # Khởi động thông thường
```

2. Chạy Frontend bằng một trong các cách sau:
   - Mở trực tiếp file `index.html` trên trình duyệt
   - Sử dụng Visual Studio Code với extension Live Server
   - Sử dụng một web server đơn giản như http-server

### Triển khai lên Vercel (Hosting public)

Dự án này đã được chuẩn bị để triển khai lên Vercel. Xem chi tiết trong file [DEPLOY.md](DEPLOY.md) để biết cách triển khai dự án lên Internet.

### API Endpoints

Backend cung cấp các API endpoints sau:

1. `POST /api/fortune`
   - Nhận: `{ fortuneType: string, playerName: string }`
   - Trả về: `{ success: true, data: { result: string, fortuneType: string, playerName: string } }`

2. `GET /api/health`
   - Trả về trạng thái API

### Tính năng
- Nhập tên và rút quẻ may mắn
- Hiển thị kết quả theo chủ đề ngẫu nhiên
- Tạo lời chúc cá nhân hóa thông qua OpenAI API được gọi từ backend
- Lưu lịch sử kết quả (tối đa 10 lần gần nhất)
- Chia sẻ kết quả qua mạng xã hội

### Lưu ý
- API key OpenAI được lưu trữ an toàn trên backend, không hiển thị trên client
- Nếu backend không hoạt động, ứng dụng sẽ hiển thị kết quả mẫu đã được cài đặt sẵn
- Để thay đổi danh sách quẻ, bạn có thể chỉnh sửa mảng `FORTUNE_TYPES` trong file `js/config.js`
- Để tùy chỉnh prompt gửi tới OpenAI, chỉnh sửa biến `promptTemplate` trong file `backend/config/config.js`

## Công nghệ sử dụng
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **API**: OpenAI API
- **Data Storage**: Web Storage API (localStorage)
- **Sharing**: Web Share API
- **Hosting**: Vercel (Serverless)

## Tùy chỉnh
- Thay đổi giao diện: Chỉnh sửa file `css/style.css`
- Thay đổi logic frontend: Chỉnh sửa file `js/main.js`
- Thay đổi danh sách quẻ: Chỉnh sửa file `js/config.js`
- Thay đổi logic backend: Chỉnh sửa các file trong thư mục `backend`

