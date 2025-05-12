import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, ParseIntPipe
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto, StudentResponseDto } from './dto/student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('students')
@Controller('students')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    @ApiOperation({ summary: 'Get all students' })
    @ApiResponse({
        status: 200,
        description: 'Returns all students',
        type: [StudentResponseDto]
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get()
    async findAll() {
        const students = await this.studentsService.findAll();
        return students.map(student => this.mapToResponseDto(student));
    }

    @ApiOperation({ summary: 'Get a specific student by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the student information',
        type: StudentResponseDto
    })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const student = await this.studentsService.findOne(id);
        return this.mapToResponseDto(student);
    }

    @ApiOperation({ summary: 'Create a new student' })
    @ApiResponse({
        status: 201,
        description: 'The student has been created successfully',
        type: StudentResponseDto
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createStudentDto: CreateStudentDto) {
        const student = await this.studentsService.create(createStudentDto);
        return this.mapToResponseDto(student);
    }

    @ApiOperation({ summary: 'Update a student' })
    @ApiResponse({
        status: 200,
        description: 'The student has been updated successfully',
        type: StudentResponseDto
    })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStudentDto: UpdateStudentDto
    ) {
        const student = await this.studentsService.update(id, updateStudentDto);
        return this.mapToResponseDto(student);
    }

    @ApiOperation({ summary: 'Delete a student' })
    @ApiResponse({ status: 204, description: 'The student has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.studentsService.remove(id);
        return { message: 'Student deleted successfully' };
    }

    private mapToResponseDto(student: any): StudentResponseDto {
        return {
            student_id: student.student_id,
            userId: student.userId,
            studentCode: student.studentCode,
            program: student.program,
            enrollmentYear: student.enrollmentYear,
            graduationYear: student.graduationYear,
            user: student.user ? {
                user_id: student.user.user_id,
                name: student.user.name,
                email: student.user.email,
                phone: student.user.phone,
                address: student.user.address,
                dateOfBirth: student.user.dateOfBirth,
                userImage: student.user.userImage,
                isActive: student.user.isActive,
            } : undefined,
            courses: student.studentCourses?.map(sc => ({
                course_id: sc.course.course_id,
                courseCode: sc.course.courseCode,
                courseName: sc.course.courseName,
            })),
        };
    }
}
