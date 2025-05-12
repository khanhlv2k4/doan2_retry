import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomsController } from './controllers/rooms.controller';
import { RoomsService } from './services/rooms.service';

@Module({
    imports: [TypeOrmModule.forFeature([Room])],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService],
})
export class RoomsModule { }
