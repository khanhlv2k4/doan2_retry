import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboard } from './entities/admin-dashboard.entity';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';
import { InstructorsModule } from '../instructors/instructors.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AdminDashboard]),
        StudentsModule,
        CoursesModule,
        InstructorsModule,
        AttendanceModule
    ],
    controllers: [AdminDashboardController],
    providers: [AdminDashboardService],
    exports: [AdminDashboardService],
})
export class AdminDashboardModule { }
