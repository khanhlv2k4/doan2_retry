import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentCoursesService } from '../services/student-courses.service';
import { CreateStudentCourseDto, UpdateStudentCourseDto, StudentCourseResponseDto } from '../dto/student-course.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('student-courses')
@Controller('student-courses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentCoursesController {
    constructor(private readonly studentCoursesService: StudentCoursesService) { }

    @ApiOperation({ summary: 'Get all student course enrollments' })
    @ApiResponse({
        status: 200,
        description: 'Return all student course enrollments',
        type: [StudentCourseResponseDto],
    })
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll() {
        const studentCourses = await this.studentCoursesService.findAll();
        return studentCourses.map(sc => this.mapToResponseDto(sc));
    }

    @ApiOperation({ summary: 'Get student course enrollment by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the student course enrollment by ID',
        type: StudentCourseResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Student course enrollment not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const studentCourse = await this.studentCoursesService.findOne(id);
        return this.mapToResponseDto(studentCourse);
    }

    @ApiOperation({ summary: 'Get student enrollments by student ID' })
    @ApiResponse({
        status: 200,
        description: 'Return enrollments for a student',
        type: [StudentCourseResponseDto],
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get('student/:studentId')
    async findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
        const studentCourses = await this.studentCoursesService.findByStudent(studentId);
        return studentCourses.map(sc => this.mapToResponseDto(sc));
    }

    @ApiOperation({ summary: 'Get student enrollments by course ID' })
    @ApiResponse({
        status: 200,
        description: 'Return enrollments for a course',
        type: [StudentCourseResponseDto],
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get('course/:courseId')
    async findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        const studentCourses = await this.studentCoursesService.findByCourse(courseId);
        return studentCourses.map(sc => this.mapToResponseDto(sc));
    }

    @ApiOperation({ summary: 'Create a new student course enrollment' })
    @ApiResponse({
        status: 201,
        description: 'Student has been enrolled in the course',
        type: StudentCourseResponseDto,
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
        const studentCourse = await this.studentCoursesService.create(createStudentCourseDto);
        return this.mapToResponseDto(studentCourse);
    }

    @ApiOperation({ summary: 'Update a student course enrollment' })
    @ApiResponse({
        status: 200,
        description: 'Student course enrollment has been updated',
        type: StudentCourseResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Student course enrollment not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStudentCourseDto: UpdateStudentCourseDto,
    ) {
        const studentCourse = await this.studentCoursesService.update(id, updateStudentCourseDto);
        return this.mapToResponseDto(studentCourse);
    }

    @ApiOperation({ summary: 'Delete a student course enrollment' })
    @ApiResponse({ status: 204, description: 'Student has been unenrolled from the course' })
    @ApiResponse({ status: 404, description: 'Student course enrollment not found' })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.studentCoursesService.remove(id);
        return { message: 'Student course enrollment deleted successfully' };
    }

    private mapToResponseDto(studentCourse: any): StudentCourseResponseDto {
        const response: StudentCourseResponseDto = {
            enrollment_id: studentCourse.enrollment_id,
            student_id: studentCourse.student_id,
            course_id: studentCourse.course_id,
            enrollment_date: studentCourse.enrollment_date,
            status: studentCourse.status,
            grade: studentCourse.grade,
            created_at: studentCourse.created_at,
            updated_at: studentCourse.updated_at
        };

        // Include student information if loaded
        if (studentCourse.student && studentCourse.student.user) {
            response.student = {
                student_id: studentCourse.student.student_id,
                name: studentCourse.student.user.name,
                email: studentCourse.student.user.email,
                student_code: studentCourse.student.student_code
            };
        }

        // Include course information if loaded
        if (studentCourse.course) {
            response.course = {
                course_id: studentCourse.course.course_id,
                course_name: studentCourse.course.course_name,
                course_code: studentCourse.course.course_code
            };
        }

        return response;
    }
}
