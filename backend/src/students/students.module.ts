import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './controllers/students.controller';
import { StudentScheduleController } from './controllers/student-schedule.controller';
import { StudentsService } from './services/students.service';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student, User]),
        UsersModule,
        ScheduleModule
    ],
    controllers: [StudentsController, StudentScheduleController],
    providers: [StudentsService],
    exports: [StudentsService],
})
export class StudentsModule { }
