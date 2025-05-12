import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateStudentDto {
    @ApiProperty({ example: 1, description: 'User ID of the student' })
    @IsNumber()
    user_id: number;

    @ApiProperty({ example: 'SV12345', description: 'Student code/ID' })
    @IsString()
    student_code: string;

    @ApiPropertyOptional({ example: 1, description: 'Class ID that student belongs to' })
    @IsOptional()
    @IsNumber()
    class_id?: number;

    @ApiProperty({ example: 'Computer Science', description: 'Department name' })
    @IsString()
    department: string;

    @ApiPropertyOptional({ example: 2022, description: 'Year of admission' })
    @IsOptional()
    @IsInt()
    @Min(2000)
    year_of_admission?: number;
}

export class UpdateStudentDto {
    @ApiPropertyOptional({ example: 1, description: 'Class ID that student belongs to' })
    @IsOptional()
    @IsNumber()
    class_id?: number;

    @ApiPropertyOptional({ example: 'Computer Science', description: 'Department name' })
    @IsOptional()
    @IsString()
    department?: string;

    @ApiPropertyOptional({ example: 2022, description: 'Year of admission' })
    @IsOptional()
    @IsInt()
    @Min(2000)
    year_of_admission?: number;
}

export class StudentResponseDto {
    @ApiProperty({ example: 1, description: 'Student ID' })
    student_id: number;

    @ApiProperty({ example: 1, description: 'User ID of the student' })
    user_id: number;

    @ApiProperty({ example: 'SV12345', description: 'Student code/ID' })
    student_code: string;

    @ApiPropertyOptional({ example: 1, description: 'Class ID that student belongs to' })
    class_id?: number;

    @ApiProperty({ example: 'Computer Science', description: 'Department name' })
    department: string;

    @ApiPropertyOptional({ example: 2022, description: 'Year of admission' })
    year_of_admission?: number;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Record creation timestamp' })
    created_at: Date;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Record update timestamp' })
    updated_at: Date;

    // Include user information
    @ApiProperty({ example: 'user@example.com', description: 'User email address' })
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name' })
    name: string;

    @ApiPropertyOptional({ example: '/uploads/avatars/user.jpg', description: 'User profile image path' })
    user_image?: string;
}
