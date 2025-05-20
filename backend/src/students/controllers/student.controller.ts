import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StudentService } from '../services/student.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('students')
@Controller('students')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Public()
    @ApiOperation({ summary: 'Get all students' })
    @ApiResponse({
        status: 200,
        description: 'Returns all students',
    })
    @Get()
    async findAll() {
        return this.studentService.findAll();
    }

    @Public()
    @ApiOperation({ summary: 'Get a specific student by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the student information',
    })
    @ApiResponse({ status: 404, description: 'Student not found' })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.findOne(id);
    }
}
