import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, Length, Matches, IsPhoneNumber, IsOptional, IsBoolean } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDto {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'Password (min 8 chars, with uppercase, lowercase, number and symbol)'
    })
    @IsString()
    @Length(8, 50)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password must include uppercase, lowercase, number/special character',
    })
    password: string;

    @ApiPropertyOptional({
        example: '+84123456789',
        description: 'Phone number (use international format with country code or leave empty)'
    })
    @IsOptional()
    @Matches(/^(\+\d{1,3}[- ]?)?\d{9,15}$/, {
        message: 'Phone must be a valid phone number. Use international format with country code (e.g., +84123456789) or local format (e.g., 0123456789)'
    })
    phone?: string;

    @ApiPropertyOptional({
        example: UserRole.STUDENT,
        enum: UserRole,
        description: 'User role (defaults to STUDENT)'
    })
    @IsOptional()
    @IsString()
    role?: UserRole;

    @ApiPropertyOptional({ example: 'http://example.com/image.jpg', description: 'User profile image URL' })
    @IsOptional()
    @IsString()
    user_image?: string;

    @ApiPropertyOptional({ example: '123 Main St, City', description: 'User address' })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth (YYYY-MM-DD)' })
    @IsOptional()
    @IsString()
    date_of_birth?: string;

    @ApiPropertyOptional({ example: true, description: 'Is user active' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({ example: false, description: 'Is email verified' })
    @IsOptional()
    @IsBoolean()
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

    @ApiPropertyOptional({ example: 'Computer Science', description: 'Department name' })
    @IsString()
    department?: string;

    @ApiPropertyOptional({ example: '2022', description: 'Year of admission' })
    @IsString()
    year_of_admission?: string;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    @IsString()
    phone?: string;
}
