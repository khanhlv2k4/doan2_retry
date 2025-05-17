import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { CreateRoomDto, UpdateRoomDto } from '../dto/room.dto';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private roomsRepository: Repository<Room>,
    ) { }

    async findAll(): Promise<Room[]> {
        return this.roomsRepository.find({
            relations: ['schedules'],
        });
    }

    async findOne(id: number): Promise<Room> {
        const room = await this.roomsRepository.findOne({
            where: { room_id: id },
            relations: ['schedules'],
        });

        if (!room) {
            throw new NotFoundException(`Room with ID ${id} not found`);
        }

        return room;
    }

    async findByRoomCode(room_code: string): Promise<Room> {
        const room = await this.roomsRepository.findOne({
            where: { room_code },
            relations: ['schedules'],
        });

        if (!room) {
            throw new NotFoundException(`Room with code ${room_code} not found`);
        }

        return room;
    }

    async create(createRoomDto: CreateRoomDto): Promise<Room> {
        // Check if room code already exists
        const existingRoom = await this.roomsRepository.findOne({
            where: { room_code: createRoomDto.room_code }
        });

        if (existingRoom) {
            throw new BadRequestException(`Room with code ${createRoomDto.room_code} already exists`);
        }

        // Create new room
        const room = this.roomsRepository.create({
            room_code: createRoomDto.room_code,
            building: createRoomDto.building,
            capacity: createRoomDto.capacity,
        });

        const savedRoom = await this.roomsRepository.save(room);
        return savedRoom;
    }

    async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
        const room = await this.findOne(id);

        // Check if room code is being changed and if it already exists
        if (updateRoomDto.room_code && updateRoomDto.room_code !== room.room_code) {
            const existingRoom = await this.roomsRepository.findOne({
                where: { room_code: updateRoomDto.room_code }
            });

            if (existingRoom) {
                throw new BadRequestException(`Room with code ${updateRoomDto.room_code} already exists`);
            }
        }

        // Update room properties
        if (updateRoomDto.room_code) room.room_code = updateRoomDto.room_code;
        if (updateRoomDto.building) room.building = updateRoomDto.building;
        if (updateRoomDto.capacity !== undefined) room.capacity = updateRoomDto.capacity;

        return this.roomsRepository.save(room);
    }

    async remove(id: number): Promise<void> {
        const room = await this.findOne(id);
        await this.roomsRepository.remove(room);
    }
}
