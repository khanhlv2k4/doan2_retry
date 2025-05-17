import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instructor } from '../entities/instructor.entity';
import { CreateInstructorDto, UpdateInstructorDto } from '../dto/instructor.dto';

@Injectable()
export class InstructorsService {
    constructor(
        @InjectRepository(Instructor)
        private instructorsRepository: Repository<Instructor>,
    ) { }

    async findAll(): Promise<Instructor[]> {
        return this.instructorsRepository.find({
            relations: ['user', 'courses'],
        });
    }

    async findOne(id: number): Promise<Instructor> {
        const instructor = await this.instructorsRepository.findOne({
            where: { instructor_id: id },
            relations: ['user', 'courses'],
        });

        if (!instructor) {
            throw new NotFoundException(`Instructor with ID ${id} not found`);
        }

        return instructor;
    }

    async findByUserId(user_id: number): Promise<Instructor> {
        const instructor = await this.instructorsRepository.findOne({
            where: { user_id },
            relations: ['user', 'courses'],
        });

        if (!instructor) {
            throw new NotFoundException(`Instructor with User ID ${user_id} not found`);
        }

        return instructor;
    }

    async create(createInstructorDto: CreateInstructorDto): Promise<Instructor> {
        // Create instructor
        const instructor = this.instructorsRepository.create({
            user_id: createInstructorDto.user_id,
            department: createInstructorDto.department,
            position: createInstructorDto.position,
            specialization: createInstructorDto.specialization,
        });

        const savedInstructor = await this.instructorsRepository.save(instructor);
        return savedInstructor;
    }

    async update(id: number, updateInstructorDto: UpdateInstructorDto): Promise<Instructor> {
        const instructor = await this.findOne(id);

        // Update instructor-specific properties
        if (updateInstructorDto.department !== undefined) {
            instructor.department = updateInstructorDto.department;
        }

        if (updateInstructorDto.position !== undefined) {
            instructor.position = updateInstructorDto.position;
        }

        if (updateInstructorDto.specialization !== undefined) {
            instructor.specialization = updateInstructorDto.specialization;
        }

        return this.instructorsRepository.save(instructor);
    }

    async remove(id: number): Promise<void> {
        const instructor = await this.findOne(id);
        await this.instructorsRepository.remove(instructor);
    }
}
