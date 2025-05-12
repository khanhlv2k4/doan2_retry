import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { QrCodesModule } from '../qr-codes/qr-codes.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { StudentsModule } from '../students/students.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance]),
        QrCodesModule,
        ScheduleModule,
        StudentsModule
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService],
})
export class AttendanceModule { }
