// Nếu có file seeder cho students, cần cập nhật tương tự

import { Student } from '../../students/entities/student.entity';
import { User, UserRole } from '../../users/entities/user.entity';
import { Connection } from 'typeorm';

export const seedStudents = async (connection: Connection) => {
    // Tìm users với vai trò student
    const users = await connection.getRepository(User)
        .find({ where: { role: UserRole.STUDENT } }); // Sử dụng enum UserRole thay vì chuỗi 'student'

    // Tạo dữ liệu student
    for (let i = 0; i < users.length; i++) {
        const student = new Student();
        student.user_id = users[i].user_id;
        student.student_code = `STU${1000 + i}`;
        student.class_id = Math.floor(Math.random() * 5) + 1; // Random class_id từ 1-5
        // Đã xóa department (không còn tồn tại trong entity)
        student.year_of_admission = 2023;

        await connection.getRepository(Student).save(student);
    }
}
