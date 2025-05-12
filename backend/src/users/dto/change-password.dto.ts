import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: 'currentPassword123', description: 'Current user password' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'newPassword123', description: 'New user password' })
    @IsString()
    @MinLength(6)
    newPassword: string;
}
