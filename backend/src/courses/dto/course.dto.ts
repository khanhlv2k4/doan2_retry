import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';

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

    @ApiPropertyOptional({ example: '2023-09-01', description: 'Course start date' })
    @IsOptional()
    start_date?: Date;

    @ApiPropertyOptional({ example: '2023-12-31', description: 'Course end date' })
    @IsOptional()
    end_date?: Date;

    @ApiPropertyOptional({ example: '2023-2024', description: 'Academic year' })
    @IsOptional()
    @IsString()
    academic_year?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether the course is active' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}

export class UpdateCourseDto {
    @ApiPropertyOptional({ example: 'Introduction to Programming', description: 'Course name' })
    @IsOptional()
    @IsString()
    course_name?: string;

    @ApiPropertyOptional({ example: 'CS101', description: 'Course code' })
    @IsOptional()
    @IsString()
    course_code?: string;

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

    @ApiPropertyOptional({ example: '2023-09-01', description: 'Course start date' })
    @IsOptional()
    start_date?: Date;

    @ApiPropertyOptional({ example: '2023-12-31', description: 'Course end date' })
    @IsOptional()
    end_date?: Date;

    @ApiPropertyOptional({ example: '2023-2024', description: 'Academic year' })
    @IsOptional()
    @IsString()
    academic_year?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether the course is active' })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
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

    @ApiPropertyOptional({ example: '2023-09-01', description: 'Start date' })
    start_date?: Date;

    @ApiPropertyOptional({ example: '2023-12-31', description: 'End date' })
    end_date?: Date;

    @ApiPropertyOptional({ example: '2023-2024', description: 'Academic year' })
    academic_year?: string;

    @ApiPropertyOptional({ example: true, description: 'Whether the course is active' })
    is_active?: boolean;

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
        description: 'Instructor information',
        additionalProperties: true
    })
    instructor?: any;
}
