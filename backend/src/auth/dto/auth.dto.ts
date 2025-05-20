import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsOptional, IsEnum, IsBoolean, IsISO8601 } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}

export class RegisterDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'user@example.com', description: 'Email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ enum: UserRole, default: UserRole.STUDENT, description: 'User role' })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @ApiPropertyOptional({ example: '0987654321', description: 'Phone number' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St', description: 'Address' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth' })
    @IsOptional()
    @IsISO8601()
    @IsString()
    date_of_birth?: string;

    @ApiPropertyOptional({ example: 'https://example.com/avatar.jpg', description: 'User image URL' })
    @IsString()
    @IsOptional()
    user_image?: string;

    @ApiPropertyOptional({ example: true, description: 'Is account active' })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Is email verified' })
    @IsBoolean()
    @IsOptional()
    email_verified?: boolean;
}

export class AuthResponseDto {
    @ApiProperty({ example: { user_id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' } })
    user: {
        user_id: number;
        name: string;
        email: string;
        role: string;
    };

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1...' })
    access_token: string;
}

export class SignupStudentDto {
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

    @ApiProperty({ example: 'SV12345', description: 'Student code/ID' })
    @IsString()
    student_code: string;

    @ApiPropertyOptional({ example: '2022', description: 'Year of admission' })
    @IsString()
    year_of_admission?: string;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    @IsString()
    phone?: string;
}

export class JwtPayloadDto {
    sub: number;
    email: string;
    role: string;
}
