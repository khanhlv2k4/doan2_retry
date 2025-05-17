import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private usersService: UsersService,
    ) { }

    async findAll(): Promise<Student[]> {
        return this.studentsRepository.find({
            relations: ['user', 'studentCourses'],
        });
    }

    async findOne(id: number): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { student_id: id },
            relations: ['user', 'studentCourses', 'studentCourses.course', 'attendances'],
        });

        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }

        return student;
    }

    async findByUserId(user_id: number): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { user_id },
            relations: ['user', 'studentCourses'],
        });

        if (!student) {
            throw new NotFoundException(`Student with User ID ${user_id} not found`);
        }

        return student;
    }

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        // Create student record
        const student = this.studentsRepository.create({
            user_id: createStudentDto.user_id,
            student_code: createStudentDto.student_code,
            class_id: createStudentDto.class_id,
            department: createStudentDto.department,
            year_of_admission: createStudentDto.year_of_admission,
        });

        return this.studentsRepository.save(student);
    }

    async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);

        // Update student-specific information
        if (updateStudentDto.class_id !== undefined)
            student.class_id = updateStudentDto.class_id;

        if (updateStudentDto.department)
            student.department = updateStudentDto.department;

        if (updateStudentDto.year_of_admission !== undefined)
            student.year_of_admission = updateStudentDto.year_of_admission;

        return this.studentsRepository.save(student);
    }

    async remove(id: number): Promise<void> {
        const student = await this.findOne(id);

        // First remove the student
        await this.studentsRepository.remove(student);

        // Then remove the associated user
        await this.usersService.remove(student.user_id);
    }
}
