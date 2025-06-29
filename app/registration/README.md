# Hệ thống Đăng ký Học phần

## Cấu trúc thư mục

```
app/registration/
├── index.tsx              # Trang chính - redirect đến select-period
├── select-period/
│   └── page.tsx           # Trang chọn đợt đăng ký
├── page.tsx               # Trang đăng ký học phần chính
└── README.md              # File này
```

## Luồng hoạt động

### 1. Trang chọn đợt đăng ký (`/registration/select-period`)

- Hiển thị danh sách tất cả các đợt đăng ký
- Cho phép người dùng chọn một đợt đăng ký cụ thể
- Hiển thị trạng thái của từng đợt (Đang mở, Sắp mở, Đã kết thúc, Đã đóng)
- Chỉ cho phép chọn các đợt đang hoạt động hoặc sắp mở

### 2. Trang đăng ký học phần (`/registration?period={maDotDK}`)

- Nhận parameter `period` từ URL
- Hiển thị thông tin đợt đăng ký đã chọn
- Lấy danh sách lớp học phần chỉ cho đợt đăng ký đó
- Cho phép đăng ký/hủy đăng ký lớp học phần

## API Endpoints

### Registration Periods

- `GET /api/dotdangky` - Lấy tất cả đợt đăng ký
- `GET /api/dotdangky/hientai` - Lấy đợt đăng ký hiện tại
- `GET /api/dotdangky/{maDotDK}` - Lấy đợt đăng ký theo ID

### Course Classes

- `GET /api/lophocphan` - Lấy tất cả lớp học phần
- `GET /api/lophocphan/dotdangky/{maDotDK}` - Lấy lớp học phần theo đợt đăng ký

### Registration

- `GET /api/dangky/sinhvien/{maSinhVien}` - Lấy danh sách đăng ký của sinh viên
- `POST /api/dangky` - Đăng ký lớp học phần
- `DELETE /api/dangky/{maPhienDK}/{maSinhVien}/{maLopHP}` - Hủy đăng ký

## Tính năng chính

### Validation

- Kiểm tra đợt đăng ký có đang hoạt động không
- Kiểm tra lớp học phần còn chỗ không
- Kiểm tra sinh viên đã đăng ký lớp này chưa
- Kiểm tra thời gian đăng ký có trong khoảng cho phép không

### UX/UI

- Loading states cho tất cả API calls
- Toast notifications cho thông báo thành công/lỗi
- Dialog confirmations cho các hành động quan trọng
- Search functionality cho tìm kiếm lớp học phần
- Responsive design
- Thống kê đăng ký (số lớp, tổng tín chỉ, trạng thái)

### Navigation

- Nút "Quay lại" để quay về trang chọn đợt đăng ký
- Nút "Làm mới" để reload dữ liệu
- Breadcrumb navigation

## Cách sử dụng

1. Truy cập `/registration` - sẽ tự động redirect đến `/registration/select-period`
2. Chọn đợt đăng ký mong muốn
3. Nhấn "Tiếp tục" để vào trang đăng ký học phần
4. Tìm kiếm và đăng ký các lớp học phần
5. Xem danh sách lớp đã đăng ký và có thể hủy đăng ký

## Lưu ý

- Hệ thống sử dụng mock student ID `SV001` - trong thực tế sẽ lấy từ user context/auth
- Tất cả API calls đều có error handling
- Validation được thực hiện ở cả frontend và backend
- UI được thiết kế responsive và user-friendly
