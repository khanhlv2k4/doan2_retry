# Danh sách các trang cần xây dựng theo từng vai trò (Role) người dùng

---

## 1. ADMIN (Quản trị viên)
**Chức năng:** Quản trị toàn hệ thống, người dùng, khóa học, thống kê, nhật ký...

- **Dashboard quản trị**
  - Thống kê tổng quan, biểu đồ, báo cáo nhanh
- **Quản lý người dùng**
  - Danh sách, tạo mới, chỉnh sửa, phân quyền, khóa/mở, xác thực email
- **Quản lý sinh viên**
  - Danh sách, thêm/sửa/xóa, xuất/import, phân lớp, xem lịch sử điểm danh
- **Quản lý giảng viên**
  - Danh sách, thêm/sửa/xóa, xem thông tin, phân khoa/bộ môn
- **Quản lý lớp học (classes)**
  - Danh sách lớp, tạo lớp, phân công chủ nhiệm, thêm/xóa/sửa
- **Quản lý phòng học (rooms)**
  - Danh sách phòng, thêm/sửa/xóa, thông tin tòa nhà, sức chứa
- **Quản lý học kỳ (semesters)**
  - Danh sách, tạo mới, chỉnh sửa, kích hoạt/vô hiệu hóa
- **Quản lý khóa học (courses)**
  - Danh sách môn, thêm/sửa/xóa, phân công giảng viên, chọn học kỳ, thống kê số SV đăng ký
- **Quản lý lịch học (schedule)**
  - Tạo/sửa/xóa lịch, phân phòng, phân ca, xem tổng thời khóa biểu
- **Duyệt & quản lý điểm danh**
  - Xem toàn bộ lịch sử điểm danh, lọc, xuất báo cáo Excel/PDF
- **Quản lý QR codes**
  - Thống kê QR đã tạo, lịch sử sử dụng, trạng thái, người tạo
- **Quản lý thông báo hệ thống**
  - Gửi thông báo hàng loạt, xem lịch sử, gửi cho nhóm cụ thể
- **Quản lý logs (nhật ký hệ thống)**
  - Xem lịch sử thao tác mọi user, tìm kiếm bất thường
- **Quản lý phiên đăng nhập**
  - Xem/thu hồi session, kiểm tra bảo mật, đăng xuất user
- **Quản lý/reset mật khẩu**
  - Cấp lại mật khẩu, kiểm tra lịch sử reset password
- **Cấu hình hệ thống**
  - Cấu hình SMTP, email, giao diện, API key, bảo mật

---

## 2. INSTRUCTOR (Giảng viên)
**Chức năng:** Quản lý lớp dạy, tạo QR điểm danh, duyệt và sửa điểm danh, gửi thông báo.

- **Dashboard giảng viên**
  - Thống kê lớp đang dạy, số buổi điểm danh, trạng thái gần nhất
- **Danh sách lớp phụ trách**
  - Xem các lớp/môn đang dạy, truy cập nhanh lớp cụ thể
- **Chi tiết lớp học**
  - Danh sách sinh viên, lịch học, lịch sử điểm danh từng buổi
- **Tạo & quản lý QR điểm danh**
  - Tạo QR cho buổi học, xem lại QR, kiểm tra trạng thái, kết quả điểm danh
- **Quản lý lịch dạy**
  - Xem, chỉnh sửa lịch cá nhân, thêm/sửa/xóa buổi, phân phòng
- **Duyệt & sửa điểm danh**
  - Xem danh sách sinh viên đã/không điểm danh, cập nhật trạng thái, thêm ghi chú lý do
- **Gửi thông báo cho sinh viên**
  - Gửi nhanh cho lớp, sinh viên, gửi file/tài liệu
- **Lịch sử thông báo đã gửi**
  - Xem lại các thông báo, trạng thái đã đọc/chưa đọc
- **Thống kê/báo cáo điểm danh lớp**
  - Báo cáo tổng hợp, xuất Excel/PDF, lọc theo buổi hoặc sinh viên
- **Thông tin cá nhân & đổi mật khẩu**

---

## 3. STUDENT (Sinh viên)
**Chức năng:** Xem lịch học, điểm danh QR, xem thông báo, tra cứu lịch sử cá nhân.

- **Dashboard sinh viên**
  - Thống kê nhanh: số buổi đi học, vắng, trễ, cảnh báo điểm danh thấp
- **Lịch học cá nhân**
  - Lịch tuần/tháng, chi tiết từng buổi, phòng, giảng viên
- **Điểm danh QR code**
  - Trang quét QR, nhập mã QR thủ công, thông báo kết quả
- **Lịch sử điểm danh**
  - Danh sách từng buổi, trạng thái (có mặt/vắng/trễ), lý do vắng, ghi chú giảng viên
- **Danh sách khóa học đã đăng ký**
  - Xem môn đang học, chi tiết lớp, giảng viên
- **Thông báo cá nhân**
  - Thông báo từ hệ thống, giảng viên, khóa học/lớp
- **Thông tin cá nhân & đổi mật khẩu**
- **Hỗ trợ/gửi yêu cầu hỗ trợ**
  - Gửi yêu cầu giải quyết sự cố, báo lỗi, liên hệ hỗ trợ

---

## 4. Các trang dùng chung (mọi role)
- **Trang đăng nhập/đăng ký**
- **Trang xác thực email/reset password**
- **Trang lỗi (404, 403) và hướng dẫn sử dụng**
- **Trang đổi mật khẩu / cập nhật thông tin cá nhân**

---

> **Lưu ý:**  
> - Mỗi trang chỉ truy cập được đúng theo vai trò.  
> - Dashboard và menu nên cá nhân hóa cho từng role.
>tối ưu thao tác điểm danh QR cho sinh viên/giảng viên khi truy cập trang web trên các thiết bị di động.