import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({ example: 'Introduction to Programming', description: 'Course name' })
    @IsString()
    course_name: string;

    @ApiProperty({ example: 'CS101', description: 'Course code' })
    @IsString()
    course_code: string;

    @ApiPropertyOptional({ example: 'Basic programming concepts', description: 'Course description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 3, description: 'Course credits' })
    @IsOptional()
    @IsNumber()
    credits?: number;

    @ApiProperty({ example: 1, description: 'Instructor ID' })
    @IsNumber()
    instructor_id: number;

    @ApiPropertyOptional({ example: 1, description: 'Semester ID' })
    @IsOptional()
    @IsNumber()
    semester_id?: number;
}

export class UpdateCourseDto {
    @ApiPropertyOptional({ example: 'Introduction to Programming', description: 'Course name' })
    @IsOptional()
    @IsString()
    course_name?: string;

    @ApiPropertyOptional({ example: 'Basic programming concepts', description: 'Course description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 3, description: 'Course credits' })
    @IsOptional()
    @IsNumber()
    credits?: number;

    @ApiPropertyOptional({ example: 1, description: 'Instructor ID' })
    @IsOptional()
    @IsNumber()
    instructor_id?: number;

    @ApiPropertyOptional({ example: 1, description: 'Semester ID' })
    @IsOptional()
    @IsNumber()
    semester_id?: number;
}

export class CourseResponseDto {
    @ApiProperty({ example: 1, description: 'Course ID' })
    course_id: number;

    @ApiProperty({ example: 'Introduction to Programming', description: 'Course name' })
    course_name: string;

    @ApiProperty({ example: 'CS101', description: 'Course code' })
    course_code: string;

    @ApiPropertyOptional({ example: 'Basic programming concepts', description: 'Course description' })
    description?: string;

    @ApiPropertyOptional({ example: 3, description: 'Course credits' })
    credits?: number;

    @ApiProperty({ example: 1, description: 'Instructor ID' })
    instructor_id: number;

    @ApiPropertyOptional({ example: 1, description: 'Semester ID' })
    semester_id?: number;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Record creation timestamp' })
    created_at: Date;

    @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Record update timestamp' })
    updated_at: Date;

    // Include instructor information
    @ApiPropertyOptional({
        type: 'object',
        example: {
            name: 'Jane Doe',
            email: 'instructor@example.com',
            department: 'Computer Science'
        },
        description: 'Instructor information'
    })
    instructor?: any;
}
