import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SemestersService } from '../services/semesters.service';
import { CreateSemesterDto, UpdateSemesterDto, SemesterResponseDto } from '../dto/semester.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('semesters')
@Controller('semesters')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SemestersController {
    constructor(private readonly semestersService: SemestersService) { }

    @ApiOperation({ summary: 'Get all semesters' })
    @ApiResponse({
        status: 200,
        description: 'Return all semesters',
        type: [SemesterResponseDto],
    })
    @Get()
    async findAll() {
        const semesters = await this.semestersService.findAll();
        return semesters.map(semester => this.mapToResponseDto(semester));
    }

    @ApiOperation({ summary: 'Get active semesters' })
    @ApiResponse({
        status: 200,
        description: 'Return active semesters',
        type: [SemesterResponseDto],
    })
    @Get('active')
    async findActive() {
        const semesters = await this.semestersService.findActive();
        return semesters.map(semester => this.mapToResponseDto(semester));
    }

    @ApiOperation({ summary: 'Get semester by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the semester by ID',
        type: SemesterResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Semester not found' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const semester = await this.semestersService.findOne(id);
        return this.mapToResponseDto(semester);
    }

    @ApiOperation({ summary: 'Create a new semester' })
    @ApiResponse({
        status: 201,
        description: 'Semester has been created successfully',
        type: SemesterResponseDto,
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createSemesterDto: CreateSemesterDto) {
        const semester = await this.semestersService.create(createSemesterDto);
        return this.mapToResponseDto(semester);
    }

    @ApiOperation({ summary: 'Update a semester' })
    @ApiResponse({
        status: 200,
        description: 'Semester has been updated successfully',
        type: SemesterResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Semester not found' })
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSemesterDto: UpdateSemesterDto,
    ) {
        const semester = await this.semestersService.update(id, updateSemesterDto);
        return this.mapToResponseDto(semester);
    }

    @ApiOperation({ summary: 'Delete a semester' })
    @ApiResponse({ status: 204, description: 'Semester has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Semester not found' })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.semestersService.remove(id);
        return { message: 'Semester deleted successfully' };
    }

    private mapToResponseDto(semester: any): SemesterResponseDto {
        return {
            semester_id: semester.semester_id,
            semester_code: semester.semester_code,
            semester_name: semester.semester_name,
            start_date: semester.start_date,
            end_date: semester.end_date,
            is_active: semester.is_active,
            created_at: semester.created_at,
            updated_at: semester.updated_at,
            courses: semester.courses ? semester.courses.map((course: any) => ({
                course_id: course.course_id,
                course_name: course.course_name,
                course_code: course.course_code
            })) : []
        };
    }
}
