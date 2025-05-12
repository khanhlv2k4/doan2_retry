import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        enum: UserRole,
        example: UserRole.STUDENT,
        description: 'User role in the system'
    })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: true, description: 'Is the user active?' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: true, description: 'Is the user active?' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class UserResponseDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    user_id: number;

    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    name: string;

    @ApiProperty({ enum: UserRole, example: UserRole.STUDENT, description: 'User role' })
    role: UserRole;

    @ApiPropertyOptional({ example: '/uploads/avatars/user.jpg', description: 'User profile image path' })
    user_image?: string;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St, City', description: 'User address' })
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'User date of birth' })
    date_of_birth?: string;

    @ApiProperty({ example: true, description: 'Whether user account is active' })
    is_active: boolean;

    @ApiProperty({ example: false, description: 'Whether user email is verified' })
    email_verified: boolean;

    @ApiPropertyOptional({ example: '2025-01-01T00:00:00.000Z', description: 'User last login timestamp' })
    last_login?: Date;
}
