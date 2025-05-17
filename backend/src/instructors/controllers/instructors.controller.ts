import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InstructorsService } from '../services/instructors.service';
import { CreateInstructorDto, UpdateInstructorDto, InstructorResponseDto } from '../dto/instructor.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('instructors')
@Controller('instructors')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) { }

    @ApiOperation({ summary: 'Get all instructors' })
    @ApiResponse({
        status: 200,
        description: 'Return all instructors',
        type: [InstructorResponseDto],
    })
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll() {
        const instructors = await this.instructorsService.findAll();
        return instructors.map(instructor => this.mapToResponseDto(instructor));
    }

    @ApiOperation({ summary: 'Get instructor by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the instructor by ID',
        type: InstructorResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Instructor not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const instructor = await this.instructorsService.findOne(id);
        return this.mapToResponseDto(instructor);
    }

    @ApiOperation({ summary: 'Create a new instructor' })
    @ApiResponse({
        status: 201,
        description: 'Instructor has been created successfully',
        type: InstructorResponseDto,
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createInstructorDto: CreateInstructorDto) {
        const instructor = await this.instructorsService.create(createInstructorDto);
        return this.mapToResponseDto(instructor);
    }

    @ApiOperation({ summary: 'Update an instructor' })
    @ApiResponse({
        status: 200,
        description: 'Instructor has been updated successfully',
        type: InstructorResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Instructor not found' })
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateInstructorDto: UpdateInstructorDto,
    ) {
        const instructor = await this.instructorsService.update(id, updateInstructorDto);
        return this.mapToResponseDto(instructor);
    }

    @ApiOperation({ summary: 'Delete an instructor' })
    @ApiResponse({ status: 204, description: 'Instructor has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Instructor not found' })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.instructorsService.remove(id);
        return { message: 'Instructor deleted successfully' };
    }

    private mapToResponseDto(instructor: any): InstructorResponseDto {
        const response: InstructorResponseDto = {
            instructor_id: instructor.instructor_id,
            user_id: instructor.user_id,
            department: instructor.department,
            position: instructor.position,
            specialization: instructor.specialization,
            created_at: instructor.created_at,
            updated_at: instructor.updated_at
        };

        if (instructor.user) {
            response.user = {
                user_id: instructor.user.user_id,
                name: instructor.user.name,
                email: instructor.user.email,
                phone: instructor.user.phone,
                role: instructor.user.role
            };
        }

        if (instructor.courses) {
            response.courses = instructor.courses.map((course: any) => ({
                course_id: course.course_id,
                course_name: course.course_name,
                course_code: course.course_code,
            }));
        }

        return response;
    }
}
