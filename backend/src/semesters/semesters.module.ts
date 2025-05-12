import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { SemestersController } from './controllers/semesters.controller';
import { SemestersService } from './services/semesters.service';

@Module({
    imports: [TypeOrmModule.forFeature([Semester])],
    controllers: [SemestersController],
    providers: [SemestersService],
    exports: [SemestersService],
})
export class SemestersModule { }
