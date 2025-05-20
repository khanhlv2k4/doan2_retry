import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, ParseIntPipe
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { StudentsService } from '../services/students.service';
import { CreateStudentDto, UpdateStudentDto, StudentResponseDto } from '../dto/student.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('students')
@Controller('students')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) { }

    // ...existing code...

    private mapToResponseDto(student: any): StudentResponseDto {
        const response: StudentResponseDto = {
            student_id: student.student_id,
            user_id: student.user_id,
            student_code: student.student_code,
            class_id: student.class_id,
            // Đã xóa trường department
            year_of_admission: student.year_of_admission,
            created_at: student.created_at,
            updated_at: student.updated_at
        };

        // Add optional properties
        if (student.user) {
            response.user = {
                user_id: student.user.user_id,
                name: student.user.name,
                email: student.user.email,
                phone: student.user.phone,
                role: student.user.role
            };
        }

        if (student.studentCourses) {
            response.courses = student.studentCourses.map((sc: any) => ({
                course_id: sc.course.course_id,
                course_code: sc.course.course_code,
                course_name: sc.course.course_name,
            }));
        }

        return response;
    }
}