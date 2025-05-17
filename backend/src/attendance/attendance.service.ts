import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { CreateAttendanceDto, UpdateAttendanceDto, RecordAttendanceDto } from './dto/attendance.dto';
import { QrCodesService } from '../qr-codes/qr-codes.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private qrCodesService: QrCodesService,
  ) { }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['student', 'student.user', 'schedule', 'schedule.course', 'schedule.room'],
    });
  }
  async findByStudent(student_id: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { student_id: student_id },
      relations: ['schedule', 'schedule.course', 'schedule.room'],
      order: { session_date: 'DESC' },
    });
  }
  async findBySchedule(schedule_id: number): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: { schedule_id: schedule_id },
      relations: ['student', 'student.user'],
      order: { student: { student_code: 'ASC' } },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        session_date: Between(startDate, endDate),
      },
      relations: ['student', 'student.user', 'schedule', 'schedule.course'],
    });
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { attendance_id: id },
      relations: ['student', 'student.user', 'schedule', 'schedule.course', 'schedule.room'],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return attendance;
  }

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Check if attendance record already exists for the student and course/date
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        student_id: createAttendanceDto.student_id,
        course_id: createAttendanceDto.course_id,
        session_date: new Date(createAttendanceDto.session_date),
      },
    });

    if (existingAttendance) {
      throw new BadRequestException(
        'Attendance record already exists for this student and course on this date',
      );
    }

    const attendance = this.attendanceRepository.create({
      student_id: createAttendanceDto.student_id,
      course_id: createAttendanceDto.course_id,
      status: createAttendanceDto.status,
      session_date: new Date(createAttendanceDto.session_date),
      notes: createAttendanceDto.notes,
    });

    return this.attendanceRepository.save(attendance);
  }
  async recordAttendance(recordAttendanceDto: RecordAttendanceDto): Promise<Attendance> {
    // Validate QR code
    const validationResult = await this.qrCodesService.validateQrCode(recordAttendanceDto.qr_code);

    if (!validationResult.isValid) {
      throw new BadRequestException('Invalid or expired QR code');
    }

    // Check if attendance already recorded
    const existingAttendance = await this.attendanceRepository.findOne({
      where: {
        student_id: recordAttendanceDto.student_id,
        course_id: validationResult.course_id,
        session_date: new Date(),
      },
    }); if (existingAttendance) {
      throw new BadRequestException('Attendance already recorded for this session');
    }

    // Record attendance
    const attendance = new Attendance();
    attendance.student_id = recordAttendanceDto.student_id;
    attendance.course_id = validationResult.course_id || 0;
    attendance.qr_id = validationResult.qr_id || 0;
    attendance.schedule_id = validationResult.schedule_id || 0;
    attendance.status = AttendanceStatus.PRESENT;
    attendance.session_date = new Date();
    attendance.notes = 'Recorded via QR code'; attendance.location = recordAttendanceDto.location ? JSON.stringify(recordAttendanceDto.location) : '';
    attendance.device_info = recordAttendanceDto.device_info ? JSON.stringify(recordAttendanceDto.device_info) : '';

    return this.attendanceRepository.save(attendance);
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);

    // Update attendance properties
    if (updateAttendanceDto.status) {
      attendance.status = updateAttendanceDto.status;
    }

    if (updateAttendanceDto.notes) {
      attendance.notes = updateAttendanceDto.notes;
    }

    return this.attendanceRepository.save(attendance);
  }

  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepository.remove(attendance);
  }

  async getStatistics(courseId?: number, semesterId?: number): Promise<any> {
    // Base query
    const queryBuilder = this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.course', 'course');

    // Apply filters
    if (courseId) {
      queryBuilder.where('course.course_id = :courseId', { courseId });
    }

    if (semesterId) {
      queryBuilder.andWhere('course.semester_id = :semesterId', { semesterId });
    }

    // Get total attendance count
    const totalCount = await queryBuilder.getCount();

    // Get status counts
    const statusCounts = await Promise.all(
      Object.values(AttendanceStatus).map(async (status) => {
        const count = await queryBuilder
          .clone()
          .andWhere('attendance.status = :status', { status })
          .getCount();

        return { status, count };
      }),
    );

    // Calculate rates
    const rates = statusCounts.reduce((acc, { status, count }) => {
      const rateKey = `${status.toLowerCase()}Rate`;
      acc[rateKey] = totalCount > 0
        ? (count / totalCount) * 100
        : 0;
      return acc;
    }, {} as Record<string, number>);

    // Return status counts as a record
    const statusCountsRecord = statusCounts.reduce((acc, { status, count }) => {
      acc[status] = count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCount,
      statusCounts: statusCountsRecord,
      ...rates,
    };
  }
}