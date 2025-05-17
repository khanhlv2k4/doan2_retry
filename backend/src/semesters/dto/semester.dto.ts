import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSemesterDto {
    @ApiProperty({ example: 'HK1_2023', description: 'Semester code' })
    @IsString()
    @IsNotEmpty()
    semester_code: string;

    @ApiProperty({ example: 'Spring 2023', description: 'Semester name' })
    @IsString()
    @IsNotEmpty()
    semester_name: string;

    @ApiProperty({ example: '2023-01-15', description: 'Start date of the semester' })
    @IsDateString()
    @IsNotEmpty()
    start_date: string;

    @ApiProperty({ example: '2023-05-30', description: 'End date of the semester' })
    @IsDateString()
    @IsNotEmpty()
    end_date: string;

    @ApiProperty({ example: true, description: 'Whether the semester is active' })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}

export class UpdateSemesterDto extends PartialType(CreateSemesterDto) { }

export class SemesterResponseDto {
    @ApiProperty({ example: 1, description: 'Semester ID' })
    semester_id: number;

    @ApiProperty({ example: 'HK1_2023', description: 'Semester code' })
    semester_code: string;

    @ApiProperty({ example: 'Spring 2023', description: 'Semester name' })
    semester_name: string;

    @ApiProperty({ example: '2023-01-15', description: 'Start date of the semester' })
    start_date: Date;

    @ApiProperty({ example: '2023-05-30', description: 'End date of the semester' })
    end_date: Date;

    @ApiProperty({ example: true, description: 'Whether the semester is active' })
    is_active: boolean;

    @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Created date' })
    created_at: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00Z', description: 'Updated date' })
    updated_at: Date;

    @ApiProperty({ type: 'array', description: 'Courses in this semester' })
    courses?: {
        course_id: number;
        course_name: string;
        course_code: string;
    }[];
}
