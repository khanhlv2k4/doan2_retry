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
    } async findByInstructor(instructor_id: number): Promise<Course[]> {
        return this.coursesRepository.find({
            where: { instructor_id: instructor_id },
            relations: ['semester', 'schedules'],
        });
    } async findBySemester(semester_id: number): Promise<Course[]> {
        return this.coursesRepository.find({
            where: { semester_id: semester_id },
            relations: ['instructor', 'instructor.user', 'schedules'],
        });
    }

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        // Check if course code already exists
        const existingCourse = await this.coursesRepository.findOne({
            where: { course_code: createCourseDto.course_code }
        });

        if (existingCourse) {
            throw new BadRequestException(`Course with code ${createCourseDto.course_code} already exists`);
        }        // Create new course
        const course = new Course();
        course.course_name = createCourseDto.course_name;
        course.course_code = createCourseDto.course_code;
        course.instructor_id = createCourseDto.instructor_id;
        course.semester_id = createCourseDto.semester_id || 0;
        course.start_date = createCourseDto.start_date ? new Date(createCourseDto.start_date) : new Date();
        course.end_date = createCourseDto.end_date ? new Date(createCourseDto.end_date) : new Date();
        course.description = createCourseDto.description || '';
        course.credits = createCourseDto.credits || 0;
        course.academic_year = createCourseDto.academic_year || '';
        course.is_active = createCourseDto.is_active ?? true;

        return this.coursesRepository.save(course);
    }

    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        const course = await this.findOne(id);

        // Check if course code is being changed and if it already exists
        if (updateCourseDto.course_code && updateCourseDto.course_code !== course.course_code) {
            const existingCourse = await this.coursesRepository.findOne({
                where: { course_code: updateCourseDto.course_code }
            });

            if (existingCourse) {
                throw new BadRequestException(`Course with code ${updateCourseDto.course_code} already exists`);
            }
        }

        // Update course properties
        if (updateCourseDto.course_name) course.course_name = updateCourseDto.course_name;
        if (updateCourseDto.course_code) course.course_code = updateCourseDto.course_code;
        if (updateCourseDto.instructor_id) course.instructor_id = updateCourseDto.instructor_id;
        if (updateCourseDto.semester_id) course.semester_id = updateCourseDto.semester_id;
        if (updateCourseDto.start_date) course.start_date = new Date(updateCourseDto.start_date);
        if (updateCourseDto.end_date) course.end_date = new Date(updateCourseDto.end_date);
        if (updateCourseDto.description) course.description = updateCourseDto.description;
        if (updateCourseDto.credits) course.credits = updateCourseDto.credits;
        if (updateCourseDto.academic_year) course.academic_year = updateCourseDto.academic_year;
        if (updateCourseDto.is_active !== undefined) course.is_active = updateCourseDto.is_active;

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
            where: { is_active: true },
            relations: ['instructor', 'instructor.user', 'semester'],
        });
    }

    async getUpcomingCourses(): Promise<Course[]> {
        const now = new Date();

        return this.coursesRepository.find({
            where: {
                start_date: MoreThan(now),
                is_active: true
            },
            relations: ['instructor', 'instructor.user', 'semester'],
            order: { start_date: 'ASC' },
        });
    }

    async getCurrentCourses(): Promise<Course[]> {
        const now = new Date();

        return this.coursesRepository.find({
            where: {
                start_date: LessThanOrEqual(now),
                end_date: MoreThanOrEqual(now),
                is_active: true
            },
            relations: ['instructor', 'instructor.user', 'semester'],
        });
    }
}
