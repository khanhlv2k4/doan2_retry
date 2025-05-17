import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { StudentsService } from '../services/students.service';

@ApiTags('student')
@Controller('student')
public class StudentScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly studentsService: StudentsService
    ) { }

    @Public()
    @ApiOperation({ summary: 'Get schedule for a student' })
    @ApiResponse({
        status: 200,
        description: 'Return all schedule entries for the student',
    })
    @Get(':studentId/schedule')
    async getStudentSchedule(@Param('studentId', ParseIntPipe) studentId: number) {
        return this.scheduleService.findByStudent(studentId);
    }
}
