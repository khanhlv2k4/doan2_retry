import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, Matches } from 'class-validator';

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export class CreateScheduleDto {
    @ApiProperty({ example: 1, description: 'Course ID' })
    @IsNumber()
    course_id: number;

    @ApiPropertyOptional({ example: 1, description: 'Room ID' })
    @IsOptional()
    @IsNumber()
    room_id?: number;

    @ApiProperty({
        example: 'Monday',
        description: 'Day of week',
        enum: DAYS_OF_WEEK,
    })
    @IsString()
    @IsIn(DAYS_OF_WEEK)
    day_of_week: string;

    @ApiProperty({
        example: '08:00:00',
        description: 'Start time (24-hour format)',
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Start time must be in HH:MM:SS format',
    })
    start_time: string;

    @ApiProperty({
        example: '10:00:00',
        description: 'End time (24-hour format)',
    })
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'End time must be in HH:MM:SS format',
    })
    end_time: string;

    @ApiPropertyOptional({
        example: 'weekly',
        description: 'Repeat pattern (weekly, biweekly, etc.)',
    })
    @IsOptional()
    @IsString()
    repeat_pattern?: string;
}

export class UpdateScheduleDto {
    @ApiPropertyOptional({ example: 1, description: 'Course ID' })
    @IsOptional()
    @IsNumber()
    course_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'Room ID' })
    @IsOptional()
    @IsNumber()
    room_id?: number;

    @ApiPropertyOptional({
        example: 'Monday',
        description: 'Day of week',
        enum: DAYS_OF_WEEK,
    })
    @IsOptional()
    @IsString()
    @IsIn(DAYS_OF_WEEK)
    day_of_week?: string;

    @ApiPropertyOptional({
        example: '08:00:00',
        description: 'Start time (24-hour format)',
    })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'Start time must be in HH:MM:SS format',
    })
    start_time?: string;

    @ApiPropertyOptional({
        example: '10:00:00',
        description: 'End time (24-hour format)',
    })
    @IsOptional()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
        message: 'End time must be in HH:MM:SS format',
    })
    end_time?: string;

    @ApiPropertyOptional({
        example: 'weekly',
        description: 'Repeat pattern (weekly, biweekly, etc.)',
    })
    @IsOptional()
    @IsString()
    repeat_pattern?: string;
}

export class ScheduleResponseDto {
    @ApiProperty({ example: 1, description: 'Schedule ID' })
    schedule_id: number;

    @ApiProperty({ example: 1, description: 'Course ID' })
    course_id: number;

    @ApiPropertyOptional({ example: 1, description: 'Room ID' })
    room_id?: number;

    @ApiProperty({ example: 'Monday', description: 'Day of week' })
    day_of_week: string;

    @ApiProperty({ example: '08:00:00', description: 'Start time' })
    start_time: string;

    @ApiProperty({ example: '10:00:00', description: 'End time' })
    end_time: string;

    @ApiProperty({ example: 'weekly', description: 'Repeat pattern' })
    repeat_pattern: string;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Creation timestamp',
    })
    created_at: Date;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'Last update timestamp',
    })
    updated_at: Date;

    @ApiPropertyOptional({
        example: {
            course_id: 1,
            course_name: 'Introduction to Programming',
            course_code: 'CS101',
        },
        description: 'Course information',
    })
    course?: {
        course_id: number;
        course_name: string;
        course_code: string;
    };

    @ApiPropertyOptional({
        example: {
            room_id: 1,
            room_code: 'A101',
            building: 'Main Building',
        },
        description: 'Room information',
    })
    room?: {
        room_id: number;
        room_code: string;
        building: string;
    };
}
