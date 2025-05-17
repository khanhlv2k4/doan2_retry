import {
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  UseGuards, 
  ParseIntPipe, 
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth, 
  ApiOperation, 
  ApiQuery, 
  ApiResponse, 
  ApiTags,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto, 
  UpdateAttendanceDto, 
  AttendanceResponseDto,
  RecordAttendanceDto,
} from './dto/attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('attendance')
@Controller('attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOperation({ summary: 'Get all attendance records' })
  @ApiResponse({
    status: 200,
    description: 'Returns all attendance records',
    type: [AttendanceResponseDto],
  })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Get()
  async findAll() {
    return this.attendanceService.findAll();
  }

  @ApiOperation({ summary: 'Get attendance records by student ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns attendance records for a student',
    type: [AttendanceResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Student not found' })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
  @Get('student/:id')
  async findByStudent(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findByStudent(id);
  }

  @ApiOperation({ summary: 'Get attendance records by schedule ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns attendance records for a schedule',
    type: [AttendanceResponseDto],
  })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Get('schedule/:id')
  async findBySchedule(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findBySchedule(id);
  }

  @ApiOperation({ summary: 'Get attendance records by date range' })
  @ApiResponse({
    status: 200,
    description: 'Returns attendance records within the date range',
    type: [AttendanceResponseDto],
  })
  @ApiQuery({ name: 'startDate', required: true, type: String, example: '2025-05-01' })
  @ApiQuery({ name: 'endDate', required: true, type: String, example: '2025-05-31' })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Get('date-range')
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.attendanceService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @ApiOperation({ summary: 'Get a specific attendance record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the attendance record',
    type: AttendanceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new attendance record manually' })
  @ApiResponse({
    status: 201,
    description: 'The attendance record has been created successfully',
    type: AttendanceResponseDto,
  })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @ApiOperation({ summary: 'Record attendance via QR code' })
  @ApiResponse({
    status: 201,
    description: 'Attendance has been recorded successfully',
    type: AttendanceResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid QR code or already recorded' })
  @Roles(UserRole.STUDENT)
  @Post('record')
  async recordAttendance(@Body() recordAttendanceDto: RecordAttendanceDto) {
    return this.attendanceService.recordAttendance(recordAttendanceDto);
  }

  @ApiOperation({ summary: 'Update an attendance record' })
  @ApiResponse({
    status: 200,
    description: 'The attendance record has been updated successfully',
    type: AttendanceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @ApiOperation({ summary: 'Delete an attendance record' })
  @ApiResponse({ status: 204, description: 'The attendance record has been deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.attendanceService.remove(id);
    return { message: 'Attendance record deleted successfully' };
  }

  @ApiOperation({ summary: 'Get attendance statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns attendance statistics',
  })
  @ApiQuery({ name: 'courseId', required: false, type: Number })
  @ApiQuery({ name: 'semesterId', required: false, type: Number })
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @Get('stats/overview')
  async getStatistics(
    @Query('courseId') courseId?: number,
    @Query('semesterId') semesterId?: number,
  ) {
    return this.attendanceService.getStatistics(courseId, semesterId);
  }
}