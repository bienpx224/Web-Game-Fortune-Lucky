# Hướng dẫn triển khai lên Vercel

Dự án này có thể triển khai lên Vercel để public cho mọi người sử dụng. Dưới đây là các bước để triển khai:

## Bước 1: Đăng ký tài khoản Vercel

1. Truy cập [Vercel](https://vercel.com) và đăng ký tài khoản (có thể sử dụng GitHub, GitLab hoặc Bitbucket)
2. Xác nhận email và hoàn tất quá trình đăng ký

## Bước 2: Cài đặt Vercel CLI (tùy chọn)

```bash
npm install -g vercel
```

## Bước 3: Chuẩn bị dự án

1. Đảm bảo dự án đã được push lên GitHub (hoặc GitLab/Bitbucket)
2. Kiểm tra file `vercel.json` đã có trong dự án
3. Đảm bảo file `.env` không bị push lên GitHub (kiểm tra trong `.gitignore`)

## Bước 4: Triển khai qua Dashboard Vercel

### Cách 1: Sử dụng Vercel Dashboard (Đề xuất)

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Nhấp vào "Add New" > "Project"
3. Import dự án từ GitHub (cấp quyền nếu cần)
4. Cấu hình dự án:
   - **Framework Preset**: Other
   - **Build Command**: Để trống
   - **Output Directory**: Để trống
   - **Environment Variables**: 
     - `OPENAI_API_KEY` = (Nhập API key OpenAI của bạn)
     - `OPENAI_MODEL` = gpt-4o-mini (hoặc model khác)
     - `OPENAI_MAX_TOKENS` = 200
     - `OPENAI_TEMPERATURE` = 0.7

5. Nhấp "Deploy"

### Cách 2: Sử dụng Vercel CLI

1. Mở terminal và điều hướng đến thư mục dự án
2. Đăng nhập vào Vercel CLI:
   ```bash
   vercel login
   ```
3. Triển khai dự án:
   ```bash
   vercel
   ```
4. Trả lời các câu hỏi cấu hình
5. Thêm các biến môi trường:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add OPENAI_MODEL
   vercel env add OPENAI_MAX_TOKENS
   vercel env add OPENAI_TEMPERATURE
   ```
6. Triển khai lại:
   ```bash
   vercel --prod
   ```

## Bước 5: Kiểm tra và chia sẻ

1. Sau khi deploy, Vercel sẽ cung cấp URL để truy cập (dạng https://your-project.vercel.app)
2. Truy cập URL để kiểm tra ứng dụng hoạt động đúng
3. Chia sẻ URL này để người khác có thể sử dụng ứng dụng

## Lưu ý quan trọng

1. **Bảo mật API Key**: Không bao giờ để API key trong mã nguồn công khai
2. **Giới hạn sử dụng**: OpenAI API có giới hạn sử dụng, hãy thiết lập giới hạn phù hợp
3. **Custom Domain**: Bạn có thể thiết lập tên miền tùy chỉnh trong dashboard Vercel
4. **Kiểm tra trong môi trường development**: Khi phát triển cục bộ, backend sẽ chạy ở port 5001

## Cập nhật dự án

Để cập nhật dự án sau khi đã triển khai:

1. Push code mới lên GitHub
2. Vercel sẽ tự động triển khai phiên bản mới (CI/CD)

Hoặc sử dụng CLI:
```bash
vercel --prod
``` 