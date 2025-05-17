import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleService } from '../services/schedule.service';
import { CreateScheduleDto, UpdateScheduleDto, ScheduleResponseDto } from '../dto/schedule.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('schedule')
@Controller('schedule')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @ApiOperation({ summary: 'Get all schedule entries' })
    @ApiResponse({
        status: 200,
        description: 'Return all schedule entries',
        type: [ScheduleResponseDto],
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get()
    async findAll() {
        const schedules = await this.scheduleService.findAll();
        return schedules.map(schedule => this.mapToResponseDto(schedule));
    }

    @ApiOperation({ summary: 'Get schedule by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the schedule by ID',
        type: ScheduleResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Schedule not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const schedule = await this.scheduleService.findOne(id);
        return this.mapToResponseDto(schedule);
    }

    @ApiOperation({ summary: 'Get schedules by course ID' })
    @ApiResponse({
        status: 200,
        description: 'Return schedules for a course',
        type: [ScheduleResponseDto],
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get('course/:courseId')
    async findByCourse(@Param('courseId', ParseIntPipe) courseId: number) {
        const schedules = await this.scheduleService.findByCourse(courseId);
        return schedules.map(schedule => this.mapToResponseDto(schedule));
    }

    @Public()
    @ApiOperation({ summary: 'Get schedules for a student' })
    @ApiResponse({
        status: 200,
        description: 'Return all schedules for a student',
        type: [ScheduleResponseDto],
    })
    @Get('student/:studentId')
    async findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
        const schedules = await this.scheduleService.findByStudent(studentId);
        return schedules.map(schedule => this.mapToResponseDto(schedule));
    }

    @ApiOperation({ summary: 'Create a new schedule entry' })
    @ApiResponse({
        status: 201,
        description: 'Schedule has been created successfully',
        type: ScheduleResponseDto,
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Post()
    async create(@Body() createScheduleDto: CreateScheduleDto) {
        const schedule = await this.scheduleService.create(createScheduleDto);
        return this.mapToResponseDto(schedule);
    }

    @ApiOperation({ summary: 'Update a schedule entry' })
    @ApiResponse({
        status: 200,
        description: 'Schedule has been updated successfully',
        type: ScheduleResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Schedule not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateScheduleDto: UpdateScheduleDto,
    ) {
        const schedule = await this.scheduleService.update(id, updateScheduleDto);
        return this.mapToResponseDto(schedule);
    }

    @ApiOperation({ summary: 'Delete a schedule entry' })
    @ApiResponse({ status: 204, description: 'Schedule has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Schedule not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.scheduleService.remove(id);
        return { message: 'Schedule deleted successfully' };
    }

    private mapToResponseDto(schedule: any): ScheduleResponseDto {
        return {
            schedule_id: schedule.schedule_id,
            course_id: schedule.course_id,
            room_id: schedule.room_id,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            repeat_pattern: schedule.repeat_pattern,
            created_at: schedule.created_at,
            updated_at: schedule.updated_at,
            course: schedule.course ? {
                course_id: schedule.course.course_id,
                course_name: schedule.course.course_name,
                course_code: schedule.course.course_code
            } : undefined,
            room: schedule.room ? {
                room_id: schedule.room.room_id,
                room_code: schedule.room.room_code,
                building: schedule.room.building
            } : undefined
        };
    }
}
