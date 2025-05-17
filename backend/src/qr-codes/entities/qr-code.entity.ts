import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('qr_codes')
export class QrCode {
    @PrimaryGeneratedColumn()
    qr_id: number; @Column({ name: 'course_id', nullable: false })
    course_id: number;

    @Column({ name: 'schedule_id', nullable: true })
    schedule_id: number;

    @Column({ name: 'qr_code', type: 'text', unique: true, nullable: false })
    qr_code: string;

    @Column({ name: 'qr_image_url', type: 'text', nullable: true })
    qr_image_url: string;

    @CreateDateColumn({ name: 'generated_at' })
    generated_at: Date;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: false })
    expires_at: Date;

    @Column({ type: 'interval', default: '10 minutes' })
    duration: string;

    @Column({ name: 'session_date', type: 'date', nullable: false })
    session_date: Date; @Column({ name: 'is_active', default: true })
    is_active: boolean;

    @Column({ name: 'created_by', nullable: true })
    created_by: number;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relationships
    @ManyToOne(() => Course, course => course.qrCodes)
    @JoinColumn({ name: 'course_id' })
    course: Course; @ManyToOne(() => Schedule, schedule => schedule.qr_codes)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Schedule; @ManyToOne(() => User, user => user.qr_codes)
    @JoinColumn({ name: 'created_by' })
    created_by_user: User;

    @OneToMany(() => Attendance, attendance => attendance.qrCode)
    attendances: Attendance[];
}
