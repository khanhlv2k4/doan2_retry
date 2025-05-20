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
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    date_of_birth?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    department?: string;

    // Các trường bổ sung cho sinh viên hoặc giảng viên
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    studentCode?: string;

    @ApiPropertyOptional()
    @IsOptional()
    yearOfAdmission?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    specialization?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    position?: string;
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
