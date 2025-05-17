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

    @ApiPropertyOptional({
        description: 'User information',
        type: 'object',
        properties: {
            user_id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', example: 'instructor@example.com' },
            phone: { type: 'string', example: '1234567890' },
            role: { type: 'string', example: 'INSTRUCTOR' }
        }
    })
    user?: {
        user_id: number;
        name: string;
        email: string;
        phone: string;
        role: string;
    };

    @ApiPropertyOptional({
        description: 'Associated courses',
        type: 'array',
        items: {
            type: 'object',
            properties: {
                course_id: { type: 'number', example: 1 },
                course_code: { type: 'string', example: 'CS101' },
                course_name: { type: 'string', example: 'Introduction to Computer Science' }
            }
        }
    })
    courses?: {
        course_id: number;
        course_code: string;
        course_name: string;
    }[];
}
