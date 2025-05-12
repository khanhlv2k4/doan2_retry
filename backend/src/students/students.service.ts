import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { UsersService } from '../users/users.service';

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

    async findByUserId(userId: number): Promise<Student> {
        const student = await this.studentsRepository.findOne({
            where: { userId },
            relations: ['user', 'studentCourses'],
        });

        if (!student) {
            throw new NotFoundException(`Student with User ID ${userId} not found`);
        }

        return student;
    }

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        // Create the base user first
        const newUser = await this.usersService.create({
            ...createStudentDto.user,
            role: UserRole.STUDENT,
        });

        // Create the student profile
        const student = this.studentsRepository.create({
            userId: newUser.user_id,
            studentCode: createStudentDto.studentCode,
            program: createStudentDto.program,
            enrollmentYear: createStudentDto.enrollmentYear,
            graduationYear: createStudentDto.graduationYear,
            user: newUser,
        });

        return this.studentsRepository.save(student);
    }

    async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
        const student = await this.findOne(id);

        // Update student-specific information
        if (updateStudentDto.studentCode) student.studentCode = updateStudentDto.studentCode;
        if (updateStudentDto.program) student.program = updateStudentDto.program;
        if (updateStudentDto.enrollmentYear) student.enrollmentYear = updateStudentDto.enrollmentYear;
        if (updateStudentDto.graduationYear) student.graduationYear = updateStudentDto.graduationYear;

        // Update base user information if provided
        if (updateStudentDto.user) {
            await this.usersService.update(student.userId, updateStudentDto.user);
        }

        return this.studentsRepository.save(student);
    }

    async remove(id: number): Promise<void> {
        const student = await this.findOne(id);

        // First remove the student
        await this.studentsRepository.remove(student);

        // Then remove the associated user
        await this.usersService.remove(student.userId);
    }
}
