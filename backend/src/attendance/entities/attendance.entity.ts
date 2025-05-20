import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { QrCode } from '../../qr-codes/entities/qr-code.entity';

export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    LATE = 'late',
    EXCUSED = 'excused',
}

@Entity('attendance')
@Unique(['student_id', 'course_id', 'session_date'])
export class Attendance {
    @PrimaryGeneratedColumn()
    attendance_id: number;

    @Column()
    student_id: number;

    @Column()
    course_id: number;

    @Column({ nullable: true })
    qr_id: number;

    @Column({ nullable: true })
    schedule_id: number;

    @Column({
        type: 'enum',
        enum: AttendanceStatus,
        enumName: 'attendance_status', // Use PostgreSQL enum name
        default: AttendanceStatus.PRESENT,
    })
    status: AttendanceStatus;

    @Column()
    session_date: Date;

    @Column({ nullable: true, default: () => 'CURRENT_TIMESTAMP' })
    scanned_at: Date;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true, type: 'text' })
    device_info: string;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ nullable: true, type: 'text' })
    notes: string;

    @Column({ nullable: true, type: 'text' })
    reason: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @ManyToOne(() => Course)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => QrCode)
    @JoinColumn({ name: 'qr_id' })
    qrCode: QrCode;

    @ManyToOne(() => Schedule)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Schedule;
}