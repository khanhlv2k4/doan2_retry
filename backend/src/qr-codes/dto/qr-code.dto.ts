import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQRCodeDto {
    @ApiProperty({ example: 1, description: 'Course ID for the QR code' })
    @IsNumber()
    course_id: number;

    @ApiProperty({ example: 1, description: 'Schedule ID for the QR code' })
    @IsNumber()
    schedule_id: number;

    @ApiProperty({ example: '2025-05-12', description: 'Session date for attendance' })
    @Type(() => Date)
    @IsDate()
    session_date: Date;

    @ApiPropertyOptional({ example: '2025-05-12T10:30:00', description: 'Expiration date' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    expires_at?: Date;

    @ApiPropertyOptional({ example: 10, description: 'QR code validity duration in minutes' })
    @IsOptional()
    @IsNumber()
    duration?: number;

    @ApiPropertyOptional({ example: 'Lecture 1', description: 'Session description' })
    @IsOptional()
    @IsString()
    session_description?: string;

    @ApiPropertyOptional({ example: 1, description: 'User ID who created the QR code' })
    @IsOptional()
    @IsNumber()
    created_by?: number;
}

export class UpdateQRCodeDto {
    @ApiPropertyOptional({ example: 10, description: 'QR code validity duration in minutes' })
    @IsOptional()
    @IsNumber()
    duration?: number;

    @ApiPropertyOptional({ example: true, description: 'Whether the QR code is active' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: '2025-05-12T10:30:00', description: 'Expiration date' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    expires_at?: Date;
}

export class QRCodeResponseDto {
    @ApiProperty({ example: 1, description: 'QR code ID' })
    qr_id: number;

    @ApiProperty({ example: 1, description: 'Course ID for the QR code' })
    course_id: number;

    @ApiProperty({ example: 1, description: 'Schedule ID for the QR code' })
    schedule_id: number;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Session date for attendance' })
    session_date: Date;

    @ApiProperty({ example: 'abc123xyz789', description: 'QR code content' })
    qr_code: string;

    @ApiProperty({ example: '2025-05-12T10:10:00.000Z', description: 'QR code expiration time' })
    expires_at: Date;

    @ApiProperty({ example: '10 minutes', description: 'QR code validity duration' })
    duration: string;

    @ApiProperty({ example: true, description: 'Whether the QR code is active' })
    is_active: boolean;

    @ApiProperty({ example: 1, description: 'User ID who created the QR code' })
    created_by: number;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Record creation timestamp' })
    created_at: Date;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Record update timestamp' })
    updated_at: Date;

    @ApiPropertyOptional({
        type: 'object',
        example: {
            course_name: 'Introduction to Programming',
            course_code: 'CS101'
        },
        description: 'Course information',
        additionalProperties: true
    })
    course?: any;
}

export class ValidateQRCodeDto {
    @ApiProperty({ example: 'abc123xyz789', description: 'QR code to validate' })
    @IsString()
    qr_code: string;
}
