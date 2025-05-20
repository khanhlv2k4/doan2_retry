import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>
    ) { }

    async findAll(): Promise<Student[]> {
        return this.studentRepository.find({
            relations: ['user', 'class'],
        });
    }

    async findOne(id: number): Promise<Student> {
        const student = await this.studentRepository.findOne({
            where: { student_id: id },
            relations: ['user', 'class'],
        });

        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }

        return student;
    }

    async findByUserId(userId: number): Promise<Student | null> {
        return this.studentRepository.findOne({
            where: { user_id: userId },
            relations: ['user', 'class'],
        });
    }
}
