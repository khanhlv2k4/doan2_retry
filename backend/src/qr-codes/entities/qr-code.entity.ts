import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('qr_codes')
export class QrCode {
    @PrimaryGeneratedColumn()
    qr_id: number;

    @Column({ name: 'course_id', nullable: false })
    courseId: number;

    @Column({ name: 'schedule_id', nullable: true })
    scheduleId: number;

    @Column({ name: 'qr_code', type: 'text', unique: true, nullable: false })
    qrCode: string;

    @Column({ name: 'qr_image_url', type: 'text', nullable: true })
    qrImageUrl: string;

    @CreateDateColumn({ name: 'generated_at' })
    generatedAt: Date;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: false })
    expiresAt: Date;

    @Column({ type: 'interval', default: '10 minutes' })
    duration: string;

    @Column({ name: 'session_date', type: 'date', nullable: false })
    sessionDate: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'created_by', nullable: true })
    createdById: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => Course, course => course.qrCodes)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Schedule, schedule => schedule.qrCodes)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Schedule;

    @ManyToOne(() => User, user => user.qrCodes)
    @JoinColumn({ name: 'created_by' })
    createdBy: User;

    @OneToMany(() => Attendance, attendance => attendance.qrCode)
    attendances: Attendance[];
}
