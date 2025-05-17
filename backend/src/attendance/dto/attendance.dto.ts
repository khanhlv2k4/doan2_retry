import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsDate,
    IsEnum,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    LATE = 'late',
    EXCUSED = 'excused',
}

export class CreateAttendanceDto {
    @ApiProperty({ example: 1, description: 'Student ID' })
    @IsNumber()
    student_id: number;

    @ApiProperty({ example: 1, description: 'Course ID' })
    @IsNumber()
    course_id: number;

    @ApiPropertyOptional({ example: 1, description: 'QR code ID' })
    @IsOptional()
    @IsNumber()
    qr_id?: number;

    @ApiProperty({ example: '2025-05-12', description: 'Session date' })
    @Type(() => Date)
    @IsDate()
    session_date: Date;

    @ApiProperty({
        enum: AttendanceStatus,
        example: AttendanceStatus.PRESENT,
        description: 'Attendance status',
    })
    @IsEnum(AttendanceStatus)
    status: AttendanceStatus;

    @ApiPropertyOptional({
        example: { browser: 'Chrome', os: 'Windows', device: 'Desktop' },
        description: 'Device information',
        additionalProperties: true,
    })
    @IsOptional()
    @IsObject()
    device_info?: Record<string, any>;

    @ApiPropertyOptional({
        example: { latitude: 10.123, longitude: 106.456 },
        description: 'Location information',
        additionalProperties: true,
    })
    @IsOptional()
    @IsObject()
    location?: Record<string, any>;

    @ApiPropertyOptional({ example: 'Student was sick', description: 'Notes about attendance' })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class UpdateAttendanceDto {
    @ApiPropertyOptional({
        enum: AttendanceStatus,
        example: AttendanceStatus.EXCUSED,
        description: 'Attendance status',
    })
    @IsOptional()
    @IsEnum(AttendanceStatus)
    status?: AttendanceStatus;

    @ApiPropertyOptional({ example: 'Student was sick', description: 'Notes about attendance' })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class RecordAttendanceDto {
    @ApiProperty({ example: 'abc123xyz789', description: 'QR code string' })
    @IsString()
    qr_code: string;

    @ApiProperty({ example: 1, description: 'Student ID' })
    @IsNumber()
    student_id: number;

    @ApiPropertyOptional({
        example: { browser: 'Chrome', os: 'Windows', device: 'Desktop' },
        description: 'Device information',
        additionalProperties: true,
    })
    @IsOptional()
    @IsObject()
    device_info?: Record<string, any>;

    @ApiPropertyOptional({
        example: { latitude: 10.123, longitude: 106.456 },
        description: 'Location information',
        additionalProperties: true,
    })
    @IsOptional()
    @IsObject()
    location?: Record<string, any>;
}

export class AttendanceResponseDto {
    @ApiProperty({ example: 1, description: 'Attendance record ID' })
    attendance_id: number;

    @ApiProperty({ example: 1, description: 'Student ID' })
    student_id: number;

    @ApiProperty({ example: 1, description: 'Course ID' })
    course_id: number;

    @ApiProperty({ example: 1, description: 'QR code ID' })
    qr_id: number;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Session date' })
    session_date: Date;

    @ApiProperty({
        enum: AttendanceStatus,
        example: AttendanceStatus.PRESENT,
        description: 'Attendance status',
    })
    status: AttendanceStatus;

    @ApiPropertyOptional({
        example: { browser: 'Chrome', os: 'Windows', device: 'Desktop' },
        description: 'Device information',
        additionalProperties: true,
    })
    device_info?: Record<string, any>;

    @ApiPropertyOptional({
        example: { latitude: 10.123, longitude: 106.456 },
        description: 'Location information',
        additionalProperties: true,
    })
    location?: Record<string, any>;

    @ApiPropertyOptional({ example: 'Student was sick', description: 'Notes about attendance' })
    notes?: string;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Time when attendance was recorded' })
    recorded_at: Date;

    @ApiPropertyOptional({
        description: 'Student information',
        type: 'object',
        example: {
            name: 'John Doe',
            student_code: 'SV12345',
        },
        additionalProperties: true,
    })
    student?: any;

    @ApiPropertyOptional({
        description: 'Course information',
        type: 'object',
        example: {
            course_name: 'Introduction to Programming',
            course_code: 'CS101',
        },
        additionalProperties: true,
    })
    course?: any;
}

export class AttendanceStatsDto {
    @ApiProperty({ example: 10, description: 'Total sessions' })
    totalSessions: number;

    @ApiProperty({ example: 8, description: 'Sessions present' })
    present: number;

    @ApiProperty({ example: 1, description: 'Sessions absent' })
    absent: number;

    @ApiProperty({ example: 1, description: 'Sessions late' })
    late: number;

    @ApiProperty({ example: 0, description: 'Sessions excused' })
    excused: number;

    @ApiProperty({ example: 80, description: 'Attendance percentage' })
    percentage: number;
}