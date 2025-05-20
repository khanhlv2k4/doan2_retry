# Trạng thái API của hệ thống

## Cấu hình API

- **API URL Base**: `http://localhost:3200` (từ NEXT_PUBLIC_API_URL trong .env)
- **Port API**: 3200
- **Tiền tố API**: Không có tiền tố mặc định, đôi khi thêm `/api` trong mã frontend

## Trạng thái JWT và xác thực

Hiện tại, hệ thống dùng JWT nhưng có một số vấn đề:

1. Backend có cấu trúc xác thực JWT nhưng chưa áp dụng nhất quán
2. Các API đang được thiết lập là "public" thông qua decorator `@Public()`
3. Một số lệnh gọi API trong frontend hiện có thêm `/api` không phù hợp với cấu hình

## Danh sách API và trạng thái public/private

### API public (không yêu cầu xác thực)

- `/auth/login`: Đăng nhập - PUBLIC
- `/auth/register`: Đăng ký - PUBLIC
- `/users`: Lấy danh sách người dùng - Được cấu hình là PUBLIC
- `/users/:id`: Lấy chi tiết người dùng - Được cấu hình là PUBLIC

### API yêu cầu xác thực (lý thuyết, nhưng hiện tại đang PUBLIC)

- `/api/users` (POST): Tạo người dùng mới (Admin only) - Thiết kế là PRIVATE
- `/api/users/:id` (PATCH): Cập nhật người dùng (Admin only) - Thiết kế là PRIVATE
- `/api/users/:id` (DELETE): Xóa người dùng (Admin only) - Thiết kế là PRIVATE
- Các endpoint khác (courses, students, attendance, etc.) - Thiết kế là PRIVATE

## Vấn đề hiện tại

1. **Không nhất quán API path**: Frontend sử dụng lẫn lộn giữa `/api/users` và `/users`
2. **JWT authentication không hoạt động đúng**: Backend đã làm cho tất cả API public
3. **Missing JWT token**: Đôi khi JWT không được gửi đúng hoặc không được xác thực
4. **Thiếu nhất quán trong việc gửi token**: Frontend không gắn token vào header một cách nhất quán

## Giải pháp

1. **Thống nhất URL API**: Quyết định sử dụng hoặc không sử dụng tiền tố `/api` và áp dụng nhất quán
2. **Tạm thời giữ tất cả API là public**: Đảm bảo frontend hoạt động trong giai đoạn phát triển
3. **Sửa frontend để sử dụng đúng URL API**: Đảm bảo tất cả các lệnh gọi API đều nhất quán
4. **Thêm localStorage token**: Đảm bảo JWT được lưu và gửi đúng

## Hiện trạng database

Database PostgreSQL đã được thiết lập với các bảng:
- users
- instructors 
- students
- classes
- courses
- attendance
- qr_codes
- ...

Database được cấu hình chính xác, chỉ cần đảm bảo API hoạt động đúng với database.
