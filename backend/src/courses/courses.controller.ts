import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, ParseIntPipe, Query
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiQuery
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import {
    CreateCourseDto, UpdateCourseDto, CourseResponseDto
} from './dto/course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('courses')
@Controller('courses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @ApiOperation({ summary: 'Get all courses' })
    @ApiResponse({
        status: 200,
        description: 'Returns all courses',
        type: [CourseResponseDto]
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get()
    async findAll() {
        return this.coursesService.findAll();
    }

    @ApiOperation({ summary: 'Get a specific course by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the course information',
        type: CourseResponseDto
    })
    @ApiResponse({ status: 404, description: 'Course not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.coursesService.findOne(id);
    }

    @ApiOperation({ summary: 'Get courses by instructor ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns courses taught by the instructor',
        type: [CourseResponseDto]
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get('instructor/:id')
    async findByInstructor(@Param('id', ParseIntPipe) instructorId: number) {
        return this.coursesService.findByInstructor(instructorId);
    }

    @ApiOperation({ summary: 'Get courses by semester ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns courses in the semester',
        type: [CourseResponseDto]
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get('semester/:id')
    async findBySemester(@Param('id', ParseIntPipe) semesterId: number) {
        return this.coursesService.findBySemester(semesterId);
    }

    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({
        status: 201,
        description: 'The course has been created successfully',
        type: CourseResponseDto
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createCourseDto: CreateCourseDto) {
        return this.coursesService.create(createCourseDto);
    }

    @ApiOperation({ summary: 'Update a course' })
    @ApiResponse({
        status: 200,
        description: 'The course has been updated successfully',
        type: CourseResponseDto
    })
    @ApiResponse({ status: 404, description: 'Course not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCourseDto: UpdateCourseDto
    ) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @ApiOperation({ summary: 'Delete a course' })
    @ApiResponse({ status: 204, description: 'The course has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.coursesService.remove(id);
        return { message: 'Course deleted successfully' };
    }
}
