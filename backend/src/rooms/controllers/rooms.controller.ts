import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomsService } from '../services/rooms.service';
import { CreateRoomDto, UpdateRoomDto, RoomResponseDto } from '../dto/room.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('rooms')
@Controller('rooms')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) { }

    @ApiOperation({ summary: 'Get all rooms' })
    @ApiResponse({
        status: 200,
        description: 'Return all rooms',
        type: [RoomResponseDto],
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get()
    async findAll() {
        const rooms = await this.roomsService.findAll();
        return rooms.map(room => this.mapToResponseDto(room));
    }

    @ApiOperation({ summary: 'Get room by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the room by ID',
        type: RoomResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const room = await this.roomsService.findOne(id);
        return this.mapToResponseDto(room);
    }

    @ApiOperation({ summary: 'Create a new room' })
    @ApiResponse({
        status: 201,
        description: 'Room has been created successfully',
        type: RoomResponseDto,
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createRoomDto: CreateRoomDto) {
        const room = await this.roomsService.create(createRoomDto);
        return this.mapToResponseDto(room);
    }

    @ApiOperation({ summary: 'Update a room' })
    @ApiResponse({
        status: 200,
        description: 'Room has been updated successfully',
        type: RoomResponseDto,
    })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateRoomDto: UpdateRoomDto,
    ) {
        const room = await this.roomsService.update(id, updateRoomDto);
        return this.mapToResponseDto(room);
    }

    @ApiOperation({ summary: 'Delete a room' })
    @ApiResponse({ status: 204, description: 'Room has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Room not found' })
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.roomsService.remove(id);
        return { message: 'Room deleted successfully' };
    }

    private mapToResponseDto(room: any): RoomResponseDto {
        return {
            room_id: room.room_id,
            room_code: room.room_code,
            building: room.building,
            capacity: room.capacity,
            created_at: room.created_at,
            updated_at: room.updated_at,
            schedules: room.schedules ? room.schedules.map((schedule: any) => ({
                schedule_id: schedule.schedule_id,
                day_of_week: schedule.day_of_week,
                start_time: schedule.start_time,
                end_time: schedule.end_time
            })) : []
        };
    }
}
