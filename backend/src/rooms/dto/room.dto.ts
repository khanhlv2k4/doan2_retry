import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRoomDto {
    @ApiProperty({ example: 'A101', description: 'Room code/number' })
    @IsString()
    @IsNotEmpty()
    room_code: string;

    @ApiProperty({ example: 'Main Building', description: 'Building name' })
    @IsString()
    @IsNotEmpty()
    building: string;

    @ApiPropertyOptional({ example: 50, description: 'Room capacity' })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    capacity?: number;
}

export class UpdateRoomDto {
    @ApiPropertyOptional({ example: 'A102', description: 'Room code/number' })
    @IsOptional()
    @IsString()
    room_code?: string;

    @ApiPropertyOptional({ example: 'Science Building', description: 'Building name' })
    @IsOptional()
    @IsString()
    building?: string;

    @ApiPropertyOptional({ example: 60, description: 'Room capacity' })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    capacity?: number;
}

export class RoomResponseDto {
    @ApiProperty({ example: 1, description: 'Room ID' })
    room_id: number;

    @ApiProperty({ example: 'A101', description: 'Room code/number' })
    room_code: string;

    @ApiProperty({ example: 'Main Building', description: 'Building name' })
    building: string;

    @ApiPropertyOptional({ example: 50, description: 'Room capacity' })
    capacity?: number;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Creation timestamp' })
    created_at: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Last update timestamp' })
    updated_at: Date;

    @ApiPropertyOptional({
        example: [
            {
                schedule_id: 1,
                day_of_week: 'Monday',
                start_time: '08:00:00',
                end_time: '10:00:00'
            }
        ],
        description: 'Schedules associated with this room'
    })
    schedules?: {
        schedule_id: number;
        day_of_week: string;
        start_time: string;
        end_time: string;
    }[];
}
