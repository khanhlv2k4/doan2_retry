import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'Email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ enum: UserRole, description: 'User role (defaults to STUDENT)' })
    @IsOptional()
    @IsString()
    role?: UserRole;

    @ApiPropertyOptional({ example: '+84123456789', description: 'Phone number' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St', description: 'User address' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth' })
    @IsOptional()
    dateOfBirth?: string | Date;

    @ApiPropertyOptional({ example: 'http://example.com/image.jpg', description: 'User image URL' })
    @IsOptional()
    @IsString()
    userImage?: string; // This property name matches what's used in auth.service.ts

    @ApiPropertyOptional({ example: true, description: 'Whether user is active' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Whether email is verified' })
    @IsOptional()
    @IsBoolean()
    emailVerified?: boolean;
}
