import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsEmail, IsString, IsNotEmpty, IsEnum, IsOptional,
    MinLength, IsBoolean, Length, Matches
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password'
    })
    @IsString()
    @Length(8, 50)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must include uppercase, lowercase, number/special character',
    })
    password: string;

    @ApiProperty({
        example: 'student',
        enum: UserRole,
        description: 'User role'
    })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St', description: 'User address' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth' })
    @IsOptional()
    @IsString()
    date_of_birth?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'User profile image' })
    @IsOptional()
    @IsString()
    user_image?: string;

    @ApiPropertyOptional({ example: true, description: 'Is user account active' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Is email verified' })
    @IsOptional()
    @IsBoolean()
    email_verified?: boolean;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({
        example: 'Password123!',
        description: 'User password'
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @ApiPropertyOptional({
        example: 'student',
        enum: UserRole,
        description: 'User role'
    })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional({ example: '+1234567890', description: 'User phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St', description: 'User address' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth' })
    @IsOptional()
    @IsString()
    date_of_birth?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'User profile image' })
    @IsOptional()
    @IsString()
    user_image?: string;

    @ApiPropertyOptional({ example: true, description: 'Is user account active' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Is email verified' })
    @IsOptional()
    @IsBoolean()
    email_verified?: boolean;
}

export class UserResponseDto {
    @ApiProperty({ example: 1 })
    user_id: number;

    @ApiProperty({ example: 'John Doe' })
    name: string;

    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'student', enum: UserRole })
    role: UserRole;

    @ApiPropertyOptional({ example: '+1234567890' })
    phone?: string | null;

    @ApiPropertyOptional({ example: '123 Main St' })
    address?: string | null;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg' })
    user_image?: string | null;

    @ApiProperty({ example: true })
    is_active: boolean;

    @ApiProperty({ example: false })
    email_verified: boolean;

    @ApiPropertyOptional({ example: '2023-01-01T00:00:00.000Z' })
    last_login?: Date | null;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    created_at: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    updated_at: Date;
}
