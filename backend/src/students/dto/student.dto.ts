import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Min } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateStudentDto {
    @ApiProperty({ description: 'User ID of the student', example: 1 })
    @IsNumber()
    @IsPositive()
    user_id: number;

    @ApiProperty({ description: 'Student code (unique)', example: 'SV12345' })
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    student_code: string;

    @ApiPropertyOptional({ description: 'Class ID the student belongs to', example: 1 })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    class_id?: number;

    // Đã xóa trường department

    @ApiPropertyOptional({ description: 'Year the student was admitted', example: 2023 })
    @IsOptional()
    @IsInt()
    @Min(2000)
    year_of_admission?: number;
}

export class UpdateStudentDto extends PartialType(
    OmitType(CreateStudentDto, ['user_id', 'student_code'] as const),
) { }

export class StudentResponseDto {
    @ApiProperty({ example: 1 })
    student_id: number;

    @ApiProperty({ example: 1 })
    user_id: number;

    @ApiProperty({ example: 'SV12345' })
    student_code: string;

    @ApiPropertyOptional({ example: 1 })
    class_id?: number;

    // Đã xóa trường department

    @ApiPropertyOptional({ example: 2023 })
    year_of_admission?: number;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    created_at: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    updated_at: Date;

    @ApiPropertyOptional()
    user?: {
        user_id: number;
        name: string;
        email: string;
        role: string;
        phone?: string;
    };

    @ApiPropertyOptional()
    courses?: Array<{
        course_id: number;
        course_code: string;
        course_name: string;
    }>;
}
