import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from '../entities/semester.entity';
import { CreateSemesterDto, UpdateSemesterDto } from '../dto/semester.dto';

@Injectable()
export class SemestersService {
    constructor(
        @InjectRepository(Semester)
        private semestersRepository: Repository<Semester>,
    ) { }

    async findAll(): Promise<Semester[]> {
        return this.semestersRepository.find({
            relations: ['courses'],
            order: {
                created_at: 'DESC',
            },
        });
    }

    async findActive(): Promise<Semester[]> {
        return this.semestersRepository.find({
            where: { is_active: true },
            relations: ['courses'],
            order: {
                created_at: 'DESC',
            },
        });
    }

    async findOne(id: number): Promise<Semester> {
        const semester = await this.semestersRepository.findOne({
            where: { semester_id: id },
            relations: ['courses'],
        });

        if (!semester) {
            throw new NotFoundException(`Semester with ID ${id} not found`);
        }

        return semester;
    }

    async create(createSemesterDto: CreateSemesterDto): Promise<Semester> {
        const semester = this.semestersRepository.create({
            semester_code: createSemesterDto.semester_code,
            semester_name: createSemesterDto.semester_name,
            start_date: new Date(createSemesterDto.start_date),
            end_date: new Date(createSemesterDto.end_date),
            is_active: createSemesterDto.is_active ?? false,
        });

        return this.semestersRepository.save(semester);
    }

    async update(id: number, updateSemesterDto: UpdateSemesterDto): Promise<Semester> {
        const semester = await this.findOne(id);

        if (updateSemesterDto.semester_code) {
            semester.semester_code = updateSemesterDto.semester_code;
        }

        if (updateSemesterDto.semester_name) {
            semester.semester_name = updateSemesterDto.semester_name;
        }

        if (updateSemesterDto.start_date) {
            semester.start_date = new Date(updateSemesterDto.start_date);
        }

        if (updateSemesterDto.end_date) {
            semester.end_date = new Date(updateSemesterDto.end_date);
        }

        if (updateSemesterDto.is_active !== undefined) {
            semester.is_active = updateSemesterDto.is_active;
        }

        return this.semestersRepository.save(semester);
    }

    async remove(id: number): Promise<void> {
        const result = await this.semestersRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Semester with ID ${id} not found`);
        }
    }
}
