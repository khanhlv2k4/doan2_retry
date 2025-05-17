-- 1. SEMESTERS
INSERT INTO semesters (semester_code, semester_name, start_date, end_date, is_active) VALUES
  ('2025A', 'Spring 2025', '2025-01-15', '2025-05-15', TRUE),
  ('2025B', 'Summer 2025', '2025-06-01', '2025-08-31', TRUE),
  ('2025C', 'Fall 2025', '2025-09-01', '2025-12-15', TRUE),
  ('2026A', 'Spring 2026', '2026-01-15', '2026-05-15', FALSE),
  ('2026B', 'Summer 2026', '2026-06-01', '2026-08-31', FALSE);

-- 2. ROOMS
INSERT INTO rooms (room_code, building, capacity) VALUES
  ('A101', 'Building A', 50),
  ('B202', 'Building B', 60),
  ('C303', 'Building C', 70),
  ('D404', 'Building D', 80),
  ('E505', 'Building E', 90);

-- 3. CLASSES
INSERT INTO classes (class_code, class_name) VALUES
  ('SE1501', 'Software Engineering 1'),
  ('DB1602', 'Database Systems'),
  ('CS1703', 'Computer Networks'),
  ('AI1804', 'Artificial Intelligence'),
  ('ML1905', 'Machine Learning');

-- 4. USERS
INSERT INTO users (name, email, password_hash, role, user_image, phone, address, date_of_birth) VALUES
  ('Admin User', 'admin@example.com', 'hashed_password1', 'admin', NULL, '0123456789', '123 Admin St', '1980-01-01'),
  ('Instructor One', 'instructor1@example.com', 'hashed_password2', 'instructor', NULL, '0987654321', '456 Instructor Ave', '1985-02-02'),
  ('Instructor Two', 'instructor2@example.com', 'hashed_password3', 'instructor', NULL, '0112233445', '789 Instructor Blvd', '1986-03-03'),
  ('Student One', 'student1@example.com', 'hashed_password4', 'student', NULL, '0223344556', '321 Student Rd', '2000-04-04'),
  ('Student Two', 'student2@example.com', 'hashed_password5', 'student', NULL, '0334455667', '654 Student Ln', '2001-05-05');

-- 5. INSTRUCTORS
INSERT INTO instructors (user_id, department, position, specialization) VALUES
  (2, 'Computer Science', 'Senior Lecturer', 'Software Engineering'),
  (3, 'Information Technology', 'Lecturer', 'Database Systems');

-- 6. STUDENTS
INSERT INTO students (user_id, student_code, class_id, year_of_admission) VALUES
  (4, 'S2025001', 1, 2025),
  (5, 'S2025002', 2, 2025);

-- 7. COURSES
INSERT INTO courses (course_name, course_code, instructor_id, semester_id, start_date, end_date, description) VALUES
  ('Introduction to Programming', 'CS101', 1, 1, '2025-01-20', '2025-05-10', 'Basic programming concepts.'),
  ('Advanced Databases', 'DB201', 2, 1, '2025-01-20', '2025-05-10', 'In-depth study of database systems.'),
  ('Networks', 'NT301', 1, 2, '2025-06-05', '2025-08-25', 'Computer networking principles.'),
  ('Artificial Intelligence', 'AI401', 2, 3, '2025-09-01', '2025-12-10', 'Introduction to AI.'),
  ('Machine Learning', 'ML501', 1, 3, '2025-09-01', '2025-12-10', 'Fundamentals of machine learning.');

-- 8. SCHEDULE
INSERT INTO schedule (course_id, room_id, day_of_week, start_time, end_time) VALUES
  (1, 1, 'Monday', '08:00', '10:00'),
  (2, 2, 'Tuesday', '10:00', '12:00'),
  (3, 3, 'Wednesday', '13:00', '15:00'),
  (4, 4, 'Thursday', '15:00', '17:00'),
  (5, 5, 'Friday', '09:00', '11:00');

-- 9. STUDENT_COURSES
INSERT INTO student_courses (student_id, course_id, status, final_grade) VALUES
  (1, 1, 'active', NULL),
  (1, 2, 'active', NULL),
  (2, 3, 'active', NULL),
  (2, 4, 'active', NULL),
  (1, 5, 'active', NULL);

-- 10. QR_CODES
INSERT INTO qr_codes (course_id, schedule_id, qr_code, qr_image_url, expires_at, session_date, created_by) VALUES
  (1, 1, 'QR001', 'http://example.com/qr1.png', '2025-01-20 10:00:00', '2025-01-20', 2),
  (2, 2, 'QR002', 'http://example.com/qr2.png', '2025-01-21 12:00:00', '2025-01-21', 3),
  (3, 3, 'QR003', 'http://example.com/qr3.png', '2025-06-05 15:00:00', '2025-06-05', 2),
  (4, 4, 'QR004', 'http://example.com/qr4.png', '2025-09-01 17:00:00', '2025-09-01', 3),
  (5, 5, 'QR005', 'http://example.com/qr5.png', '2025-09-02 11:00:00', '2025-09-02', 2);

-- 11. ATTENDANCE
INSERT INTO attendance (student_id, course_id, qr_id, schedule_id, scanned_at, status) VALUES
  (1, 1, 1, 1, '2025-01-20 08:05:00', 'present'),
  (1, 2, 2, 2, '2025-01-21 10:10:00', 'late'),
  (2, 3, 3, 3, '2025-06-05 13:00:00', 'present'),
  (2, 4, 4, 4, '2025-09-01 15:05:00', 'absent'),
  (1, 5, 5, 5, '2025-09-02 09:00:00', 'excused');

-- 12. NOTIFICATIONS
INSERT INTO notifications (user_id, title, message) VALUES
  (1, 'System Maintenance', 'The system will be down for maintenance on 2025-01-25.'),
  (2, 'New Course Assigned', 'You have been assigned to teach CS101.'),
  (3, 'Schedule Update', 'Your class schedule has been updated.'),
  (4, 'Attendance Reminder', 'Please remember to mark your attendance.'),
  (5, 'Grade Released', 'Your final grade for CS101 has been released.');
