import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password: string;
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
    studentCode: string;

    @ApiPropertyOptional({ example: 'Computer Science', description: 'Department name' })
    @IsString()
    department?: string;

    @ApiPropertyOptional({ example: '2022', description: 'Year of admission' })
    @IsString()
    yearOfAdmission?: string;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St, City', description: 'User address' })
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1990-01-01', description: 'User date of birth' })
    @IsString()
    dateOfBirth?: string;
}

export class SignupInstructorDto {
    @ApiProperty({ example: 'instructor@example.com', description: 'User email address' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Jane Doe', description: 'User full name' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Computer Science', description: 'Department name' })
    @IsString()
    department: string;

    @ApiPropertyOptional({ example: 'Senior Lecturer', description: 'Position in the institution' })
    @IsString()
    position?: string;

    @ApiPropertyOptional({ example: 'Machine Learning', description: 'Specialization field' })
    @IsString()
    specialization?: string;

    @ApiPropertyOptional({ example: '0987654321', description: 'User phone number' })
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: '123 Main St, City', description: 'User address' })
    @IsString()
    address?: string;

    @ApiPropertyOptional({ example: '1980-01-01', description: 'User date of birth' })
    @IsString()
    dateOfBirth?: string;
}

export class AuthResponseDto {
    @ApiProperty({ example: 'JWT Token', description: 'Access token for authenticated user' })
    access_token: string;

    @ApiProperty({ example: 'user data', description: 'User information' })
    user: any;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'abc123', description: 'Password reset token' })
    @IsString()
    token: string;

    @ApiProperty({ example: 'newpassword123', description: 'New password' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'newpassword123', description: 'Confirm new password' })
    @IsString()
    @MinLength(6)
    confirmPassword: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'currentpassword', description: 'Current password' })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: 'newpassword123', description: 'New password' })
    @IsString()
    @MinLength(6)
    newPassword: string;

    @ApiProperty({ example: 'newpassword123', description: 'Confirm new password' })
    @IsString()
    @MinLength(6)
    confirmPassword: string;
}
