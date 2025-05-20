import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { StudentController } from './controllers/student.controller';
import { StudentScheduleController } from './controllers/student-schedule.controller';
import { StudentService } from './services/student.service';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student, User]),
        ScheduleModule
    ],
    controllers: [StudentController, StudentScheduleController],
    providers: [StudentService],
    exports: [StudentService],
})
export class StudentsModule { }
