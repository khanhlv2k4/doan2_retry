import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
    ) { }

    async findAll(): Promise<Course[]> {
        return this.coursesRepository.find({
            relations: ['instructor', 'instructor.user', 'semester', 'schedules'],
        });
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.coursesRepository.findOne({
            where: { course_id: id },
            relations: ['instructor', 'instructor.user', 'semester', 'schedules', 'studentCourses', 'studentCourses.student'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async findByInstructor(instructorId: number): Promise<Course[]> {
        return this.coursesRepository.find({
            where: { instructorId },
            relations: ['semester', 'schedules'],
        });
    }

    async findBySemester(semesterId: number): Promise<Course[]> {
        return this.coursesRepository.find({
            where: { semesterId },
            relations: ['instructor', 'instructor.user', 'schedules'],
        });
    }

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        // Check if course code already exists
        const existingCourse = await this.coursesRepository.findOne({
            where: { courseCode: createCourseDto.courseCode }
        });

        if (existingCourse) {
            throw new BadRequestException(`Course with code ${createCourseDto.courseCode} already exists`);
        }

        // Create new course
        const course = this.coursesRepository.create({
            courseName: createCourseDto.courseName,
            courseCode: createCourseDto.courseCode,
            instructorId: createCourseDto.instructorId,
            semesterId: createCourseDto.semesterId,
            startDate: new Date(createCourseDto.startDate),
            endDate: new Date(createCourseDto.endDate),
            description: createCourseDto.description,
            credits: createCourseDto.credits,
            academicYear: createCourseDto.academicYear,
            isActive: createCourseDto.isActive ?? true,
        });

        return this.coursesRepository.save(course);
    }

    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.findOne(id);

        // Check if course code is being changed and if it already exists
        if (updateCourseDto.courseCode && updateCourseDto.courseCode !== course.courseCode) {
            const existingCourse = await this.coursesRepository.findOne({
                where: { courseCode: updateCourseDto.courseCode }
            });

            if (existingCourse) {
                throw new BadRequestException(`Course with code ${updateCourseDto.courseCode} already exists`);
            }
        }

        // Update course properties
        if (updateCourseDto.courseName) course.courseName = updateCourseDto.courseName;
        if (updateCourseDto.courseCode) course.courseCode = updateCourseDto.courseCode;
        if (updateCourseDto.instructorId) course.instructorId = updateCourseDto.instructorId;
        if (updateCourseDto.semesterId) course.semesterId = updateCourseDto.semesterId;
        if (updateCourseDto.startDate) course.startDate = new Date(updateCourseDto.startDate);
        if (updateCourseDto.endDate) course.endDate = new Date(updateCourseDto.endDate);
        if (updateCourseDto.description) course.description = updateCourseDto.description;
        if (updateCourseDto.credits) course.credits = updateCourseDto.credits;
        if (updateCourseDto.academicYear) course.academicYear = updateCourseDto.academicYear;
        if (updateCourseDto.isActive !== undefined) course.isActive = updateCourseDto.isActive;

        return this.coursesRepository.save(course);
    }

    async remove(id: number): Promise<void> {
        const course = await this.findOne(id);
        await this.coursesRepository.remove(course);
    }

    async getStudentCount(courseId: number): Promise<number> {
        const course = await this.coursesRepository.findOne({
            where: { course_id: courseId },
            relations: ['studentCourses'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        return course.studentCourses.length;
    }

    async getActiveCourses(): Promise<Course[]> {
        return this.coursesRepository.find({
            where: { isActive: true },
            relations: ['instructor', 'instructor.user', 'semester'],
        });
    }

    async getUpcomingCourses(): Promise<Course[]> {
        const now = new Date();

        return this.coursesRepository.find({
            where: {
                startDate: MoreThan(now),
                isActive: true
            },
            relations: ['instructor', 'instructor.user', 'semester'],
            order: { startDate: 'ASC' },
        });
    }

    async getCurrentCourses(): Promise<Course[]> {
        const now = new Date();

        return this.coursesRepository.find({
            where: {
                startDate: LessThanOrEqual(now),
                endDate: MoreThanOrEqual(now),
                isActive: true
            },
            relations: ['instructor', 'instructor.user', 'semester'],
        });
    }
}
