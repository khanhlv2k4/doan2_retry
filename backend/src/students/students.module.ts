import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Student, User]),
        UsersModule,
    ],
    controllers: [StudentsController],
    providers: [StudentsService],
    exports: [StudentsService],
})
export class StudentsModule { }
