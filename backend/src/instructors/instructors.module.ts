import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entities/instructor.entity';
import { InstructorsController } from './controllers/instructors.controller';
import { InstructorsService } from './services/instructors.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Instructor]),
        UsersModule
    ],
    controllers: [InstructorsController],
    providers: [InstructorsService],
    exports: [InstructorsService],
})
export class InstructorsModule { }
