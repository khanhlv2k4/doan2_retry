import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentCourse } from '../entities/student-course.entity';
import { CreateStudentCourseDto, UpdateStudentCourseDto } from '../dto/student-course.dto';

@Injectable()
export class StudentCoursesService {
    constructor(
        @InjectRepository(StudentCourse)
        private studentCoursesRepository: Repository<StudentCourse>,
    ) { }

    async findAll(): Promise<StudentCourse[]> {
        return this.studentCoursesRepository.find({
            relations: ['student', 'student.user', 'course'],
        });
    }

    async findOne(id: number): Promise<StudentCourse> {
        const studentCourse = await this.studentCoursesRepository.findOne({
            where: { enrollment_id: id },
            relations: ['student', 'student.user', 'course'],
        });

        if (!studentCourse) {
            throw new NotFoundException(`Student course enrollment with ID ${id} not found`);
        }

        return studentCourse;
    }

    async findByStudent(studentId: number): Promise<StudentCourse[]> {
        return this.studentCoursesRepository.find({
            where: { student_id: studentId },
            relations: ['student', 'student.user', 'course'],
        });
    }

    async findByCourse(courseId: number): Promise<StudentCourse[]> {
        return this.studentCoursesRepository.find({
            where: { course_id: courseId },
            relations: ['student', 'student.user', 'course'],
        });
    }

    async create(createStudentCourseDto: CreateStudentCourseDto): Promise<StudentCourse> {
        // Check if student is already enrolled in the course
        const existingEnrollment = await this.studentCoursesRepository.findOne({
            where: {
                student_id: createStudentCourseDto.student_id,
                course_id: createStudentCourseDto.course_id,
            },
        });

        if (existingEnrollment) {
            throw new BadRequestException('Student is already enrolled in this course');
        }

        // Create new enrollment
        const studentCourse = new StudentCourse();
        studentCourse.student_id = createStudentCourseDto.student_id;
        studentCourse.course_id = createStudentCourseDto.course_id;
        studentCourse.enrollment_date = new Date();
        studentCourse.status = createStudentCourseDto.status || 'active';
        studentCourse.grade = createStudentCourseDto.grade || 0;

        return this.studentCoursesRepository.save(studentCourse);
    }

    async update(id: number, updateStudentCourseDto: UpdateStudentCourseDto): Promise<StudentCourse> {
        const studentCourse = await this.findOne(id);

        if (updateStudentCourseDto.status) {
            studentCourse.status = updateStudentCourseDto.status;
        }

        if (updateStudentCourseDto.grade !== undefined) {
            studentCourse.grade = updateStudentCourseDto.grade;
        }

        return this.studentCoursesRepository.save(studentCourse);
    }

    async remove(id: number): Promise<void> {
        const studentCourse = await this.findOne(id);
        await this.studentCoursesRepository.remove(studentCourse);
    }
}
