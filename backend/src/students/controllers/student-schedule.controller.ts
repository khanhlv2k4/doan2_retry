import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { ScheduleService } from '../../schedule/services/schedule.service';
import { StudentService } from '../services/student.service';

@ApiTags('student')
@Controller('student')
export class StudentScheduleController {
    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly studentService: StudentService
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
