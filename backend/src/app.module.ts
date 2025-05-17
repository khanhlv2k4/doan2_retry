import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { InstructorsModule } from './instructors/instructors.module';
import { ClassesModule } from './classes/classes.module';
import { SemestersModule } from './semesters/semesters.module';
import { RoomsModule } from './rooms/rooms.module';
import { CoursesModule } from './courses/courses.module';
import { ScheduleModule } from './schedule/schedule.module';
import { StudentCoursesModule } from './student-courses/student-courses.module';
import { QrCodesModule } from './qr-codes/qr-codes.module';
import { AttendanceModule } from './attendance/attendance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
    StudentsModule,
    InstructorsModule,
    ClassesModule,
    SemestersModule,
    RoomsModule,
    CoursesModule,
    ScheduleModule,
    StudentCoursesModule,
    QrCodesModule,
    AttendanceModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
