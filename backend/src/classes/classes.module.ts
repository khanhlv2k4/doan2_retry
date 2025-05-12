import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/class.entity';
import { ClassesController } from './controllers/classes.controller';
import { ClassesService } from './services/classes.service';

@Module({
    imports: [TypeOrmModule.forFeature([Class])],
    controllers: [ClassesController],
    providers: [ClassesService],
    exports: [ClassesService],
})
export class ClassesModule { }
