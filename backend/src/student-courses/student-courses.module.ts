import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCourse } from './entities/student-course.entity';
import { StudentCoursesController } from './controllers/student-courses.controller';
import { StudentCoursesService } from './services/student-courses.service';
import { StudentsModule } from '../students/students.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StudentCourse]),
        StudentsModule,
        CoursesModule
    ],
    controllers: [StudentCoursesController],
    providers: [StudentCoursesService],
    exports: [StudentCoursesService],
})
export class StudentCoursesModule { }
