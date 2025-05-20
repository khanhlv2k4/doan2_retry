import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { CreateScheduleDto, UpdateScheduleDto } from '../dto/schedule.dto';

@Injectable()
export class ScheduleService {
    constructor(
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
    ) { }

    async findAll(): Promise<Schedule[]> {
        return this.scheduleRepository.find({
            relations: ['course', 'room'],
        });
    }

    async findOne(id: number): Promise<Schedule> {
        const schedule = await this.scheduleRepository.findOne({
            where: { schedule_id: id },
            relations: ['course', 'room'],
        });

        if (!schedule) {
            throw new NotFoundException(`Schedule with ID ${id} not found`);
        }

        return schedule;
    }
    async findByCourse(courseId: number): Promise<Schedule[]> {
        return this.scheduleRepository.find({
            where: { course_id: courseId },
            relations: ['course', 'room'],
        });
    }

    async findByStudent(studentId: number): Promise<Schedule[]> {
        try {
            // Truy vấn lịch học của sinh viên dựa trên các khóa học mà sinh viên đã đăng ký
            const schedules = await this.scheduleRepository
                .createQueryBuilder('schedule')
                .innerJoin('student_courses', 'sc', 'sc.course_id = schedule.course_id')
                .innerJoinAndSelect('schedule.course', 'course')
                .leftJoinAndSelect('course.instructor', 'instructor')
                .leftJoinAndSelect('instructor.user', 'instructorUser')
                .leftJoinAndSelect('schedule.room', 'room')
                .where('sc.student_id = :studentId', { studentId })
                .getMany();

            return schedules;
        } catch (error) {
            console.error('Error finding schedules for student:', error);
            return [];
        }
    }

    async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
        // Check for time conflicts in the same room
        if (createScheduleDto.room_id) {
            const conflicts = await this.scheduleRepository
                .createQueryBuilder('schedule')
                .where('schedule.room_id = :roomId', { roomId: createScheduleDto.room_id })
                .andWhere('schedule.day_of_week = :dayOfWeek', { dayOfWeek: createScheduleDto.day_of_week })
                .getMany();

            const newStart = new Date(`1970-01-01T${createScheduleDto.start_time}`);
            const newEnd = new Date(`1970-01-01T${createScheduleDto.end_time}`);

            for (const conflict of conflicts) {
                const existingStart = new Date(`1970-01-01T${conflict.start_time}`);
                const existingEnd = new Date(`1970-01-01T${conflict.end_time}`);

                if (
                    (newStart >= existingStart && newStart < existingEnd) ||
                    (newEnd > existingStart && newEnd <= existingEnd) ||
                    (newStart <= existingStart && newEnd >= existingEnd)
                ) {
                    throw new BadRequestException(
                        `Schedule conflicts with existing schedule (ID: ${conflict.schedule_id}) in the same room`
                    );
                }
            }
        }

        // Create new schedule
        const schedule = new Schedule();
        schedule.course_id = createScheduleDto.course_id;
        schedule.room_id = createScheduleDto.room_id || 0;
        schedule.day_of_week = createScheduleDto.day_of_week;
        schedule.start_time = new Date(`1970-01-01T${createScheduleDto.start_time}`);
        schedule.end_time = new Date(`1970-01-01T${createScheduleDto.end_time}`);
        schedule.repeat_pattern = createScheduleDto.repeat_pattern || 'weekly';

        return this.scheduleRepository.save(schedule);
    }

    async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
        const schedule = await this.findOne(id);        // Check for time conflicts if room, day, or time is being changed
        if (
            (updateScheduleDto.room_id && updateScheduleDto.room_id !== schedule.room_id) ||
            (updateScheduleDto.day_of_week && updateScheduleDto.day_of_week !== schedule.day_of_week) ||
            (updateScheduleDto.start_time && updateScheduleDto.start_time !== schedule.start_time.toString()) ||
            (updateScheduleDto.end_time && updateScheduleDto.end_time !== schedule.end_time.toString())
        ) {
            const room_id = updateScheduleDto.room_id || schedule.room_id;
            const day_of_week = updateScheduleDto.day_of_week || schedule.day_of_week;      // Get all schedules for the same room and day of week except the current one
            const conflicts = await this.scheduleRepository
                .createQueryBuilder('schedule')
                .where('schedule.room_id = :roomId', { roomId: room_id })
                .andWhere('schedule.day_of_week = :dayOfWeek', { dayOfWeek: day_of_week })
                .andWhere('schedule.schedule_id != :scheduleId', { scheduleId: id })
                .getMany();

            const newStart = new Date(`1970-01-01T${updateScheduleDto.start_time || schedule.start_time}`);
            const newEnd = new Date(`1970-01-01T${updateScheduleDto.end_time || schedule.end_time}`);

            for (const conflict of conflicts) {
                const existingStart = new Date(`1970-01-01T${conflict.start_time}`);
                const existingEnd = new Date(`1970-01-01T${conflict.end_time}`);

                if (
                    (newStart >= existingStart && newStart < existingEnd) ||
                    (newEnd > existingStart && newEnd <= existingEnd) ||
                    (newStart <= existingStart && newEnd >= existingEnd)
                ) {
                    throw new BadRequestException(
                        `Schedule conflicts with existing schedule (ID: ${conflict.schedule_id}) in the same room`
                    );
                }
            }
        }

        // Update schedule properties
        if (updateScheduleDto.course_id !== undefined) {
            schedule.course_id = updateScheduleDto.course_id;
        }

        if (updateScheduleDto.room_id !== undefined) {
            schedule.room_id = updateScheduleDto.room_id;
        }

        if (updateScheduleDto.day_of_week) {
            schedule.day_of_week = updateScheduleDto.day_of_week;
        }
        if (updateScheduleDto.start_time) {
            schedule.start_time = new Date(`1970-01-01T${updateScheduleDto.start_time}`);
        }

        if (updateScheduleDto.end_time) {
            schedule.end_time = new Date(`1970-01-01T${updateScheduleDto.end_time}`);
        }

        if (updateScheduleDto.repeat_pattern) {
            schedule.repeat_pattern = updateScheduleDto.repeat_pattern;
        }

        return this.scheduleRepository.save(schedule);
    }

    async remove(id: number): Promise<void> {
        const schedule = await this.findOne(id);
        await this.scheduleRepository.remove(schedule);
    }
}
