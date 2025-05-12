-- SCHEMA TỐI ƯU ĐIỂM DANH QR CODE (KHÔNG LỖI, COMMENT ĐÚNG CHUẨN)

-- 1. ENUMS
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;

CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE notification_type AS ENUM ('system', 'attendance', 'course', 'user');
CREATE TYPE notification_status AS ENUM ('unread', 'read');

-- 2. DROP TABLES (nếu tồn tại, để không lỗi khi chạy lại)
DROP TABLE IF EXISTS admin_dashboard CASCADE;
DROP TABLE IF EXISTS password_reset CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS qr_codes CASCADE;
DROP TABLE IF EXISTS student_courses CASCADE;
DROP TABLE IF EXISTS schedule CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;

-- 3. SEMESTERS
CREATE TABLE semesters (
    semester_id SERIAL PRIMARY KEY,              -- 1
    semester_code VARCHAR(20) UNIQUE NOT NULL,   -- 2
    semester_name VARCHAR(100) NOT NULL,         -- 3
    start_date DATE NOT NULL,                    -- 4
    end_date DATE NOT NULL,                      -- 5
    is_active BOOLEAN DEFAULT TRUE,              -- 6
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 7
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 8
);

-- 4. ROOMS
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,                  -- 1
    room_code VARCHAR(20) UNIQUE NOT NULL,       -- 2
    building VARCHAR(100) NOT NULL,              -- 3
    capacity INT,                                -- 4
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 5
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 6
);

-- 5. CLASSES
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,                 -- 1
    class_code VARCHAR(50) UNIQUE NOT NULL,      -- 2
    class_name VARCHAR(255) NOT NULL,            -- 3
    department VARCHAR(100),                     -- 4
    head_teacher_id INT,                         -- 5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 6
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 7
);

-- 6. USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,                  -- 1
    name VARCHAR(255) NOT NULL,                  -- 2
    email VARCHAR(255) UNIQUE NOT NULL,          -- 3
    password_hash TEXT NOT NULL,                 -- 4
    role user_role NOT NULL,                     -- 5
    user_image VARCHAR(255),                     -- 6
    phone VARCHAR(20),                           -- 7
    address TEXT,                                -- 8
    date_of_birth DATE,                          -- 9
    is_active BOOLEAN DEFAULT TRUE,              -- 10
    last_login TIMESTAMP,                        -- 11
    email_verified BOOLEAN DEFAULT FALSE,        -- 12
    verification_token TEXT,                     -- 13
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 14
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 15
);

-- 7. INSTRUCTORS
CREATE TABLE instructors (
    instructor_id SERIAL PRIMARY KEY,            -- 1
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE, -- 2
    department VARCHAR(100) NOT NULL,            -- 3
    position VARCHAR(100),                       -- 4
    specialization TEXT,                         -- 5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 6
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 7
);

-- 8. STUDENTS
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,               -- 1
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE, -- 2
    student_code VARCHAR(50) UNIQUE NOT NULL,    -- 3
    class_id INT REFERENCES classes(class_id),   -- 4
    department VARCHAR(100) NOT NULL,            -- 5
    year_of_admission INT,                       -- 6
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 7
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 8
);

-- 9. COURSES
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,                -- 1
    course_name VARCHAR(255) NOT NULL,           -- 2
    course_code VARCHAR(50) UNIQUE NOT NULL,     -- 3
    instructor_id INT NOT NULL REFERENCES instructors(instructor_id) ON DELETE CASCADE, -- 4
    semester_id INT REFERENCES semesters(semester_id), -- 5
    start_date DATE NOT NULL,                    -- 6
    end_date DATE NOT NULL,                      -- 7
    description TEXT,                            -- 8
    credits INT NOT NULL DEFAULT 3,              -- 9
    academic_year VARCHAR(20),                   -- 10
    is_active BOOLEAN DEFAULT TRUE,              -- 11
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 12
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 13
);

-- 10. SCHEDULE
CREATE TABLE schedule (
    schedule_id SERIAL PRIMARY KEY,              -- 1
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE, -- 2
    room_id INT REFERENCES rooms(room_id),       -- 3
    day_of_week VARCHAR(10) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL, -- 4
    start_time TIME NOT NULL,                    -- 5
    end_time TIME NOT NULL,                      -- 6
    repeat_pattern VARCHAR(50) DEFAULT 'weekly', -- 7
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 8
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 9
);

-- 11. STUDENT_COURSES
CREATE TABLE student_courses (
    enrollment_id SERIAL,                        -- 1
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, -- 2
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,   -- 3
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 4
    status VARCHAR(20) DEFAULT 'active',         -- 5
    final_grade DECIMAL(5,2),                    -- 6
    PRIMARY KEY (student_id, course_id)
);

-- 12. QR_CODES
CREATE TABLE qr_codes (
    qr_id SERIAL PRIMARY KEY,                    -- 1
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,     -- 2
    schedule_id INT REFERENCES schedule(schedule_id) ON DELETE CASCADE,         -- 3
    qr_code TEXT UNIQUE NOT NULL,                -- 4
    qr_image_url TEXT,                           -- 5
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 6
    expires_at TIMESTAMP NOT NULL,               -- 7
    duration INTERVAL DEFAULT INTERVAL '10 minutes', -- 8
    session_date DATE NOT NULL,                  -- 9
    is_active BOOLEAN DEFAULT TRUE,              -- 10
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL, -- 11
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 12
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 13
);

-- 13. ATTENDANCE
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,            -- 1
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE, -- 2
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,   -- 3
    qr_id INT REFERENCES qr_codes(qr_id) ON DELETE SET NULL,                  -- 4
    schedule_id INT REFERENCES schedule(schedule_id) ON DELETE SET NULL,      -- 5
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 6
    status attendance_status NOT NULL DEFAULT 'present', -- 7
    session_date DATE NOT NULL,                  -- 8
    location VARCHAR(255),                       -- 9
    device_info TEXT,                            -- 10
    ip_address VARCHAR(50),                      -- 11
    notes TEXT,                                  -- 12
    reason TEXT,                                 -- 13
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 14
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 15
    UNIQUE (student_id, course_id, session_date)
);

-- 14. NOTIFICATIONS
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,          -- 1
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,-- 2
    title VARCHAR(255) NOT NULL,                 -- 3
    message TEXT NOT NULL,                       -- 4
    type notification_type NOT NULL DEFAULT 'system', -- 5
    status notification_status NOT NULL DEFAULT 'unread', -- 6
    related_id INT,                              -- 7
    related_type VARCHAR(50),                    -- 8
    is_read BOOLEAN DEFAULT FALSE,               -- 9
    read_at TIMESTAMP,                           -- 10
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 11
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 12
);

-- 15. LOGS
CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,                   -- 1
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL, -- 2
    action VARCHAR(100) NOT NULL,                -- 3
    entity_type VARCHAR(50) NOT NULL,            -- 4
    entity_id INT NOT NULL,                      -- 5
    details JSONB,                               -- 6
    ip_address VARCHAR(50),                      -- 7
    user_agent TEXT,                             -- 8
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 9
);

-- 16. USER_SESSIONS
CREATE TABLE user_sessions (
    session_id SERIAL PRIMARY KEY,               -- 1
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,-- 2
    token VARCHAR(255) UNIQUE NOT NULL,          -- 3
    ip_address VARCHAR(50),                      -- 4
    user_agent TEXT,                             -- 5
    expires_at TIMESTAMP NOT NULL,               -- 6
    is_valid BOOLEAN DEFAULT TRUE,               -- 7
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 8
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 9
);

-- 17. PASSWORD_RESET
CREATE TABLE password_reset (
    reset_id SERIAL PRIMARY KEY,                 -- 1
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,-- 2
    token VARCHAR(255) UNIQUE NOT NULL,          -- 3
    expires_at TIMESTAMP NOT NULL,               -- 4
    is_used BOOLEAN DEFAULT FALSE,               -- 5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 6
);

-- 18. ADMIN_DASHBOARD
CREATE TABLE admin_dashboard (
    dashboard_id SERIAL PRIMARY KEY,             -- 1
    total_students INT NOT NULL,                 -- 2
    total_courses INT NOT NULL,                  -- 3
    total_instructors INT NOT NULL,              -- 4
    total_attendance_records INT NOT NULL,       -- 5
    attendance_rate DECIMAL(5,2),               -- 6
    present_rate DECIMAL(5,2),                  -- 7
    absent_rate DECIMAL(5,2),                   -- 8
    late_rate DECIMAL(5,2),                     -- 9
    data_date DATE DEFAULT CURRENT_DATE,         -- 10
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 11
);



## 1. **Các vai trò (Roles)**
- **admin**: Quản trị hệ thống, kiểm soát toàn bộ, thêm/xóa/sửa mọi dữ liệu, quản lý người dùng, báo cáo thống kê.
- **instructor**: Giảng viên, quản lý lớp mình dạy, tạo QR điểm danh, xem danh sách lớp, kiểm tra/duyệt điểm danh, gửi thông báo.
- **student**: Sinh viên, xem lịch học, tham gia điểm danh bằng QR, xem thông báo, xem lịch sử điểm danh cá nhân.

---

## 2. **Chức năng theo vai trò**

### **A. Trang quản trị (dành cho `admin`):**
- Quản lý người dùng (users): tạo, phân quyền, lock/unlock, thiết lập xác thực email.
- Quản lý giảng viên (`instructors`), sinh viên (`students`), lớp học (`classes`), phòng học (`rooms`), học kỳ (`semesters`).
- Quản lý và kiểm duyệt tất cả các khóa học (`courses`), lịch học (`schedule`).
- Xem & xuất báo cáo thống kê (`admin_dashboard`): số lượng SV, GV, khóa học, tỷ lệ điểm danh, vắng/trễ...
- Xem nhật ký hệ thống (`logs`): ai làm gì, ở đâu, khi nào.
- Gửi thông báo hệ thống cho mọi user.
- Đặt lại mật khẩu cho bất kỳ user nào (qua bảng `password_reset`).

### **B. Trang giảng viên (dành cho `instructor`):**
- Xem danh sách lớp học mình phụ trách, danh sách sinh viên trong lớp học (`student_courses`, `classes`).
- Tạo và quản lý lịch học, phòng học, buổi học (`schedule`, `rooms`).
- Khởi tạo và quản lý QR điểm danh cho từng buổi học (`qr_codes`).
- Xem, phê duyệt và sửa trạng thái điểm danh của sinh viên (`attendance`, ví dụ sửa từ "absent" sang "excused").
- Gửi thông báo đến sinh viên lớp mình dạy (`notifications`).
- Xem thống kê điểm danh của lớp mình phụ trách.

### **C. Trang sinh viên (dành cho `student`):**
- Xem lịch học cá nhân, lịch khóa học đã đăng ký (`student_courses`, `schedule`).
- Tham gia điểm danh bằng cách quét QR code trên ứng dụng/web (`attendance`).
- Xem lịch sử điểm danh của chính mình, biết được mình đi học/vắng/trễ bao nhiêu buổi.
- Nhận và xem thông báo liên quan (từ giảng viên, hệ thống, khóa học).
- Đổi mật khẩu, cập nhật thông tin cá nhân.

---

## 3. **Tác dụng/ý nghĩa các bảng chính**

- **users**: Lưu thông tin tài khoản đăng nhập, role, xác thực, trạng thái.
- **students/instructors**: Lưu thông tin chi tiết tương ứng, liên kết profile với user.
- **classes/rooms/semesters**: Quản lý lớp học, phòng học, học kỳ, cho phép phân chia rõ ràng, dễ tìm kiếm.
- **courses**: Định nghĩa khóa học, liên kết instructor, học kỳ, lớp.
- **schedule**: Lịch học chi tiết từng buổi, phòng, thời gian, ngày trong tuần.
- **student_courses**: Quan hệ nhiều-nhiều giữa sinh viên và khóa học.
- **qr_codes**: Lưu từng mã QR ứng với từng buổi học, kiểm soát thời gian hiệu lực.
- **attendance**: Ghi nhận từng lần sinh viên điểm danh, trạng thái (có mặt, vắng, trễ, có phép), truy vết thiết bị, vị trí.
- **notifications**: Lưu mọi thông báo gửi cho user, loại, trạng thái đọc/chưa đọc.
- **logs**: Nhật ký hệ thống, ai thao tác gì, ở đâu, lúc nào, giúp audit và bảo mật.
- **user_sessions**: Quản lý các phiên đăng nhập, bảo vệ truy cập an toàn.
- **password_reset**: Lưu lịch sử/phiên đặt lại mật khẩu.
- **admin_dashboard**: Lưu snapshot thống kê quản trị, phục vụ báo cáo, truy vấn nhanh.

---

## 4. **Tóm tắt luồng nghiệp vụ chính**
- **Admin**: Thiết lập hệ thống, thêm user, phân quyền, tạo các entity cơ bản (lớp, phòng, học kỳ), kiểm soát mọi thứ.
- **Giảng viên**: Tạo QR cho buổi học → Sinh viên điểm danh → Giảng viên và admin kiểm tra/thống kê kết quả.
- **Sinh viên**: Đăng nhập → xem lịch học → quét QR điểm danh → nhận thông báo → xem lịch sử cá nhân.

---

## 5. **Bảo mật & kiểm soát**
- Mỗi thao tác thay đổi dữ liệu đều có thể log lại (`logs`).
- Tài khoản có xác thực email, trạng thái active/inactive.
- Session, reset password token đều có expiry, chống tấn công brute force.
- Phân quyền nghiêm ngặt, không thể truy cập trái phép dữ liệu của role khác.