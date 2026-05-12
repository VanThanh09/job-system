# HỆ THỐNG QUẢN LÝ TÌM KIẾM VIỆC LÀM

Hệ thống quản lý tuyển dụng trực tuyến toàn diện kết nối ứng viên và nhà tuyển dụng, tích hợp tính năng gợi ý việc làm/ứng viên thông minh bằng AI (FAISS/Transformers), trò chuyện trực tuyến (Realtime Chat), phỏng vấn trực tuyến (Video Call), và hệ thống thanh toán (Stripe).

## Triển khai

**Back-end:** http://3.24.182.254/

**Database host:** http://3.24.182.254:8080
```
username: root

password: 123456

database_name: jobdjango
```
**Front-end:** https://vieclammoi.site/

## Thông Tin Tài Khoản Đăng Nhập 

Hệ thống được phân quyền với các vai trò khác nhau. Dưới đây là các tài khoản demo để sử dụng và kiểm thử hệ thống:

| Tài khoản (Tên đăng nhập / Email) | Mật khẩu | Vai trò (Role) | Quyền hạn & Chức năng chính |
| :--- | :--- | :--- | :--- |
| admin | 123 | **ADMIN** | Link: **http://3.24.182.254/admin** .Quản trị toàn bộ hệ thống, xem thống kê doanh thu, quản lý danh mục, quản lý người dùng, xét duyệt hồ sơ công ty đăng ký mới, quản lý cấu hình hệ thống và mức phí. |
| employer | 123 | **EMPLOYER** | **Nhà tuyển dụng**: Cập nhật hồ sơ công ty, đăng tin tuyển dụng (có tính phí qua Stripe), xem và quản lý CV ứng tuyển, nhận gợi ý ứng viên phù hợp bằng AI, chat với ứng viên, tạo phòng phỏng vấn trực tuyến (qua Daily.co), đánh giá ứng viên. |
| candidate | 123 | **CANDIDATE** | **Ứng viên**: Cập nhật thông tin cá nhân/CV, tìm kiếm việc làm, ứng tuyển, nhận gợi ý việc làm bằng AI, theo dõi công ty, đánh giá công ty, chat với nhà tuyển dụng, tham gia phỏng vấn trực tuyến. |

## 1. Các Chức Năng Chính (Features)

### 👨‍💼 Dành cho Ứng viên (Candidate)
- **Quản lý hồ sơ & CV**: Cập nhật thông tin cá nhân, upload CV (lưu trữ an toàn trên Cloudinary), hoặc hỗ trợ xuất CV cá nhân ra định dạng PDF.
- **Tìm kiếm & Ứng tuyển**: Tìm kiếm việc làm theo từ khóa/ngành nghề, xem chi tiết thông tin công ty và nộp hồ sơ ứng tuyển dễ dàng.
- **Gợi ý việc làm thông minh (AI Match)**: Hệ thống sử dụng mô hình NLP (Transformers) kết hợp cơ sở dữ liệu Vector (FAISS) để phân tích CV và gợi ý các công việc có độ tương đồng cao.
- **Tương tác & Theo dõi**: Theo dõi (Follow) các công ty yêu thích để nhận thông báo mới, đánh giá (Rating) môi trường làm việc của công ty.
- **Giao tiếp trực tiếp**: Chat realtime với nhà tuyển dụng thông qua WebSockets.
- **Phỏng vấn trực tuyến**: Nhận link và tham gia phỏng vấn trực tuyến video call trực tiếp trên nền tảng.
- **Quản lý thông báo**: Nhận thông báo (Notifications) tức thời về trạng thái duyệt hồ sơ, thông tin tuyển dụng mới.

### 🏢 Dành cho Nhà tuyển dụng (Employer)
- **Quản lý Hồ sơ Công ty**: Khởi tạo và cập nhật đầy đủ thông tin, hình ảnh của công ty.
- **Quản lý tin tuyển dụng**: Đăng tin tuyển dụng mới. Hỗ trợ hệ thống thanh toán phí đăng tin an toàn qua cổng Stripe (Tạo Invoice, webhook xử lý tự động).
- **Quản lý ứng viên**: Theo dõi danh sách ứng viên đã nộp CV, thay đổi trạng thái (Duyệt/Từ chối).
- **Gợi ý ứng viên (AI Match)**: Tự động phân tích yêu cầu của tin đăng và quét trong hệ thống để đưa ra danh sách các ứng viên tiềm năng nhất.
- **Phỏng vấn trực tuyến (Video Interview)**: Quản lý các phiên phỏng vấn, tạo phòng họp video (tích hợp Daily.co API) và gửi lời mời đến ứng viên.
- **Tương tác**: Trò chuyện trực tiếp (Chat) với ứng viên, xem đánh giá và phản hồi đánh giá.

### ⚙️ Dành cho Quản trị viên (Admin / Staff)
- Quản lý người dùng, phân quyền hệ thống.
- Quản lý các danh mục (Categories) ngành nghề.
- Xem dashboard thống kê, biểu đồ doanh thu từ việc thu phí đăng tin tuyển dụng.

---

## 2. Sơ Đồ Kiến Trúc Hệ Thống (System Architecture Diagram)

![system-struture](https://res.cloudinary.com/drzc4fmxb/image/upload/v1778417307/structure_phan_bien_khoa_luan_og8cbo.png)

## 3. Công Nghệ Sử Dụng (Tech Stack)

### Backend (Django)
- **Core**: Django 5.2, Django REST Framework, OAuth2 Toolkit.
- **Database**: MySQL (`PyMySQL`).
- **Realtime / Chat**: Django Channels, `channels_redis`, WebSockets.
- **AI / Machine Learning**: `sentence-transformers`, `faiss-cpu`, `torch`, `scikit-learn` (Xử lý và so khớp Vector tìm ứng viên/việc làm).
- **Background Tasks**: Celery, Redis, `amqp`.
- **Third-party Integrations**: 
  - Cloudinary (Lưu trữ ảnh, file CV).
  - Stripe (Thanh toán phí đăng tin tuyển dụng).
  - Daily.co (Hệ thống Video Call phỏng vấn).

### Frontend (React.js)
- **Core**: React.js 19, React Router DOM.
- **UI/UX**: React Bootstrap 5, Lucide React / React Icons.
- **State/API**: Axios, React Cookies.
- **Third-party Integrations**: 
  - `@daily-co/daily-react` (Giao diện Video Call trực tiếp).
  - `html2pdf.js` (Xuất PDF).
  - GrapesJS (Công cụ Web Builder nếu có).

---

## 4. Hướng Dẫn Cài Đặt (Installation) & Cấu Hình


### 5.1. Cấu hình Backend (Django)

#### Back-end deloy: http://3.24.182.254/

#### 1. Clone the repository

```bash
git clone https://github.com/VanThanh09/djang-job-system-backend.git
cd djang-job-system-backend
```

#### 2. Configure environment

```bash
cp .env.example .env   # Create .env from template
# Edit variables in .env as needed
```

#### 3. Run with Docker (recommended)

```bash

# Build project
docker-compose --build

# Start project
docker-compose up -d
```

**App đã chạy xong bỏ qua các bước còn lại. Nếu không dùng docker bỏ qua bước này chuyển sang bước 4**

#### 4. Run services locally (development)

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### 5. Database Setup
1. **Install MySQL**:

    - For Linux:

        ```sh
        sudo apt-get install mysql-server
        ```

    - For Windows: Download and install MySQL from [here](https://dev.mysql.com/downloads/installer/).

2. **Login to MySQL**:
   
    Trong project sử dụng user 'root' với password '123456' và database name 'jobdjango'
   
    Cấu hình config database riêng ở `.env`

#### 6. **Database Migration**

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 7. Start server & Celery worker

```bash
# Start server
python manage.py runserver
```

```bash
# Worker - process background tasks
celery -A celery_app.celery_app worker --loglevel=debug --concurrency=1
```

### 5.2. Cấu hình Frontend (React.js)

#### 1. Đảm bảo máy tính đã cài đặt **Node.js** (Phiên bản 18+).

#### 2. Clone the repository

```bash
git clone https://github.com/VanThanh09/reactjs-job-system-frontend.git
cd reactjs-job-system-frontend
```

#### 3. Cài đặt các gói phụ thuộc (dependencies):

   ```bash
   npm install
   ```

#### 5. Khởi chạy ứng dụng:
   ```bash
   npm start
   ```
#### 6. Truy cập ứng dụng tại địa chỉ: `http://localhost:3000`.

#### 7. Kết nối front-end và back-end

Hiện API đang gọi tới hook tại: http://3.24.182.254/. 

Cấu hình local hook tại  `reactjs-job-system-frontend\src\configs\Apis.js`
```
const BASE_URL = "<Your-local-host>" #Example: http://127.0.0.1:8000/
```
