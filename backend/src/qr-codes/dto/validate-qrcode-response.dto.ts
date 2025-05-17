import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidateQrCodeResponseDto {
    @ApiProperty({ example: true, description: 'Whether the QR code is valid' })
    isValid: boolean;

    @ApiPropertyOptional({ example: 1, description: 'Course ID related to the QR code' })
    course_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'Schedule ID related to the QR code' })
    schedule_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'QR code ID' })
    qr_id?: number;
}
