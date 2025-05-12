import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstructorDto {
    @ApiProperty({ example: 1, description: 'User ID of the instructor' })
    @IsNumber()
    user_id: number;

    @ApiProperty({ example: 'Computer Science', description: 'Department name' })
    @IsString()
    department: string;

    @ApiPropertyOptional({ example: 'Senior Lecturer', description: 'Position in the institution' })
    @IsOptional()
    @IsString()
    position?: string;

    @ApiPropertyOptional({ example: 'Machine Learning', description: 'Specialization field' })
    @IsOptional()
    @IsString()
    specialization?: string;
}

export class UpdateInstructorDto {
    @ApiPropertyOptional({ example: 'Computer Science', description: 'Department name' })
    @IsOptional()
    @IsString()
    department?: string;

    @ApiPropertyOptional({ example: 'Senior Lecturer', description: 'Position in the institution' })
    @IsOptional()
    @IsString()
    position?: string;

    @ApiPropertyOptional({ example: 'Machine Learning', description: 'Specialization field' })
    @IsOptional()
    @IsString()
    specialization?: string;
}

export class InstructorResponseDto {
    @ApiProperty({ example: 1, description: 'Instructor ID' })
    instructor_id: number;

    @ApiProperty({ example: 1, description: 'User ID of the instructor' })
    user_id: number;

    @ApiProperty({ example: 'Computer Science', description: 'Department name' })
    department: string;

    @ApiPropertyOptional({ example: 'Senior Lecturer', description: 'Position in the institution' })
    position?: string;

    @ApiPropertyOptional({ example: 'Machine Learning', description: 'Specialization field' })
    specialization?: string;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Record creation timestamp' })
    created_at: Date;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Record update timestamp' })
    updated_at: Date;

    // Include user information
    @ApiProperty({ example: 'instructor@example.com', description: 'User email address' })
    email: string;

    @ApiProperty({ example: 'Jane Doe', description: 'User full name' })
    name: string;

    @ApiPropertyOptional({ example: '/uploads/avatars/instructor.jpg', description: 'User profile image path' })
    user_image?: string;
}
