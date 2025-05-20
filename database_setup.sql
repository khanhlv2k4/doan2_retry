-- 1. ENUMS
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS notification_status CASCADE;

-- Vai trò của người dùng trong hệ thống
CREATE TYPE user_role AS ENUM ('admin', 'instructor', 'student');

-- Trạng thái điểm danh của sinh viên
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- Loại thông báo
CREATE TYPE notification_type AS ENUM ('system', 'attendance', 'course', 'user');

-- Trạng thái đọc của thông báo
CREATE TYPE notification_status AS ENUM ('unread', 'read');

-- 2. DROP TABLES
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
    semester_id SERIAL PRIMARY KEY,                  -- Khóa chính, định danh duy nhất học kỳ
    semester_code VARCHAR(20) UNIQUE NOT NULL,       -- Mã học kỳ duy nhất (VD: 2025A)
    semester_name VARCHAR(100) NOT NULL,             -- Tên mô tả học kỳ (VD: Spring 2025)
    start_date DATE NOT NULL,                        -- Ngày bắt đầu học kỳ
    end_date DATE NOT NULL,                          -- Ngày kết thúc học kỳ
    is_active BOOLEAN DEFAULT TRUE,                  -- Cờ đánh dấu học kỳ hiện đang hoạt động
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Thời điểm cập nhật gần nhất
);

-- 4. ROOMS
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,                      -- Khóa chính
    room_code VARCHAR(20) UNIQUE NOT NULL,           -- Mã phòng học (VD: A101)
    building VARCHAR(100) NOT NULL,                  -- Tòa nhà chứa phòng
    capacity INT,                                    -- Sức chứa tối đa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 5. CLASSES
CREATE TABLE classes (
    class_id SERIAL PRIMARY KEY,                     -- Khóa chính
    class_code VARCHAR(50) UNIQUE NOT NULL,          -- Mã lớp (VD: SE1501)
    class_name VARCHAR(255) NOT NULL,                -- Tên lớp (VD: Software Engineering 1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Thời điểm tạo lớp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Thời điểm cập nhật gần nhất
);

-- 6. USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,                      -- Khóa chính người dùng
    name VARCHAR(255) NOT NULL,                      -- Họ tên người dùng
    email VARCHAR(255) UNIQUE NOT NULL,              -- Email duy nhất, dùng để đăng nhập
    password_hash TEXT NOT NULL,                     -- Mật khẩu đã mã hóa
    role user_role NOT NULL,                         -- Vai trò của người dùng (admin/instructor/student)
    user_image VARCHAR(255),                         -- URL ảnh đại diện
    phone VARCHAR(20),                               -- Số điện thoại
    address TEXT,                                    -- Địa chỉ người dùng
    date_of_birth DATE,                              -- Ngày sinh
    last_login TIMESTAMP,                            -- Thời điểm đăng nhập gần nhất
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo tài khoản
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 7. INSTRUCTORS
CREATE TABLE instructors (
    instructor_id SERIAL PRIMARY KEY,                -- Khóa chính
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến bảng users
    position VARCHAR(100),                           -- Chức vụ (Trưởng khoa, Giảng viên chính,...)
    specialization TEXT,                             -- Chuyên ngành chuyên sâu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 8. STUDENTS
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,                   -- Khóa chính
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE, -- Liên kết đến bảng users
    student_code VARCHAR(50) UNIQUE NOT NULL,        -- Mã số sinh viên duy nhất
    class_id INT REFERENCES classes(class_id),       -- Liên kết tới lớp đang học
    year_of_admission INT,                           -- Năm nhập học
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 9. COURSES
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,                    -- Khóa chính
    course_name VARCHAR(255) NOT NULL,               -- Tên học phần (VD: Database Systems)
    course_code VARCHAR(50) UNIQUE NOT NULL,         -- Mã môn học duy nhất
    instructor_id INT NOT NULL REFERENCES instructors(instructor_id) ON DELETE CASCADE, -- Người phụ trách
    semester_id INT REFERENCES semesters(semester_id), -- Thuộc học kỳ nào
    start_date DATE NOT NULL,                        -- Ngày bắt đầu môn học
    end_date DATE NOT NULL,                          -- Ngày kết thúc môn học
    description TEXT,                                -- Mô tả chi tiết môn học
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo môn học
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 10. SCHEDULE
CREATE TABLE schedule (
    schedule_id SERIAL PRIMARY KEY,                  -- Khóa chính
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE, -- Thuộc môn học nào
    room_id INT REFERENCES rooms(room_id),           -- Học tại phòng nào
    day_of_week VARCHAR(10) CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')) NOT NULL, -- Ngày học trong tuần
    start_time TIME NOT NULL,                        -- Giờ bắt đầu
    end_time TIME NOT NULL,                          -- Giờ kết thúc
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 11. STUDENT_COURSES
CREATE TABLE student_courses (
    enrollment_id SERIAL,                            -- ID đăng ký (auto increment)
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE, -- Sinh viên đăng ký
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,   -- Môn học đăng ký
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Ngày đăng ký
    status VARCHAR(20) DEFAULT 'active',             -- Trạng thái (active/dropped/finished)
    final_grade DECIMAL(5,2),                        -- Điểm tổng kết
    PRIMARY KEY (student_id, course_id)              -- Khóa chính kết hợp đảm bảo 1 SV chỉ đăng ký 1 lần mỗi môn
);

-- 12. QR_CODES
CREATE TABLE qr_codes (
    qr_id SERIAL PRIMARY KEY,                        -- Khóa chính
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,     -- Môn học
    schedule_id INT REFERENCES schedule(schedule_id) ON DELETE CASCADE,         -- Lịch học tương ứng
    qr_code TEXT UNIQUE NOT NULL,                    -- Nội dung mã QR (UUID hoặc mã hóa)
    qr_image_url TEXT,                               -- URL ảnh QR
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,-- Thời điểm tạo mã QR
    expires_at TIMESTAMP NOT NULL,                   -- Hạn sử dụng QR
    duration INTERVAL DEFAULT INTERVAL '10 minutes', -- Khoảng thời gian hợp lệ
    session_date DATE NOT NULL,                      -- Ngày học cụ thể
    is_active BOOLEAN DEFAULT TRUE,                  -- Cờ đánh dấu QR đang hoạt động
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL, -- Người tạo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

-- 13. ATTENDANCE
CREATE TABLE attendance (
    attendance_id SERIAL PRIMARY KEY,                -- Khóa chính
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE, -- Ai điểm danh
    course_id INT NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,   -- Môn học liên quan
    qr_id INT REFERENCES qr_codes(qr_id) ON DELETE SET NULL,                  -- Mã QR dùng điểm danh
    schedule_id INT REFERENCES schedule(schedule_id) ON DELETE SET NULL,      -- Buổi học
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Thời điểm điểm danh
    status attendance_status NOT NULL DEFAULT 'present', -- Trạng thái điểm danh
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Ngày tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    -- Ngày cập nhật cuối
);

-- 14. NOTIFICATIONS
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,              -- Khóa chính
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE, -- Người nhận thông báo
    title VARCHAR(255) NOT NULL,                     -- Tiêu đề thông báo
    message TEXT NOT NULL,                           -- Nội dung thông báo
    notification_type notification_type NOT NULL,    -- Loại thông báo
    status notification_status DEFAULT 'unread',     -- Trạng thái đọc
    related_id INT,                                  -- ID của đối tượng liên quan (course_id, attendance_id...)
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL, -- Người tạo thông báo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ngày tạo thông báo
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Ngày cập nhật cuối
);

