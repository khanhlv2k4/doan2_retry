import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateStudentCourseDto {
    @ApiProperty({ example: 1, description: 'Student ID' })
    @IsNumber()
    @IsNotEmpty()
    student_id: number;

    @ApiProperty({ example: 1, description: 'Course ID' })
    @IsNumber()
    @IsNotEmpty()
    course_id: number;

    @ApiPropertyOptional({
        example: 'active',
        description: 'Enrollment status',
        enum: ['active', 'completed', 'dropped', 'pending']
    })
    @IsOptional()
    @IsString()
    @IsIn(['active', 'completed', 'dropped', 'pending'])
    status?: string;

    @ApiPropertyOptional({
        example: 85.5,
        description: 'Student grade for the course (0-100)'
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    grade?: number;
}

export class UpdateStudentCourseDto extends PartialType(CreateStudentCourseDto) { }

export class StudentCourseResponseDto {
    @ApiProperty({ example: 1, description: 'Enrollment ID' })
    enrollment_id: number;

    @ApiProperty({ example: 1, description: 'Student ID' })
    student_id: number;

    @ApiProperty({ example: 1, description: 'Course ID' })
    course_id: number;

    @ApiProperty({ example: '2023-01-15T12:00:00Z', description: 'Date of enrollment' })
    enrollment_date: Date;

    @ApiProperty({
        example: 'active',
        description: 'Enrollment status',
        enum: ['active', 'completed', 'dropped', 'pending']
    })
    status: string;

    @ApiPropertyOptional({ example: 85.5, description: 'Student grade for the course (0-100)' })
    grade?: number;

    @ApiProperty({ example: '2023-01-15T12:00:00Z', description: 'Created date' })
    created_at: Date;

    @ApiProperty({ example: '2023-01-15T12:00:00Z', description: 'Updated date' })
    updated_at: Date;

    @ApiPropertyOptional({
        description: 'Student information',
        type: 'object',
        properties: {
            student_id: { type: 'number', example: 1 },
            student_code: { type: 'string', example: 'S12345' },
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', example: 'jane.doe@example.com' }
        }
    })
    student?: {
        student_id: number;
        student_code: string;
        name: string;
        email: string;
    };

    @ApiPropertyOptional({
        description: 'Course information',
        type: 'object',
        properties: {
            course_id: { type: 'number', example: 1 },
            course_code: { type: 'string', example: 'CS101' },
            course_name: { type: 'string', example: 'Introduction to Computer Science' }
        }
    })
    course?: {
        course_id: number;
        course_code: string;
        course_name: string;
    };
}
