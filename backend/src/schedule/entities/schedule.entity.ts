import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Room } from '../../rooms/entities/room.entity';
import { QrCode } from '../../qr-codes/entities/qr-code.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('schedule')
export class Schedule {
    @PrimaryGeneratedColumn()
    schedule_id: number;

    @Column({ nullable: false })
    course_id: number;

    @Column({ nullable: true })
    room_id: number;

    @Column({ length: 10, nullable: false })
    day_of_week: string;

    @Column({ type: 'time', nullable: false })
    start_time: Date;

    @Column({ type: 'time', nullable: false })
    end_time: Date;

    @Column({ length: 50, default: 'weekly' })
    repeat_pattern: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relationships
    @ManyToOne(() => Course, course => course.schedules)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Room, room => room.schedules)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @OneToMany(() => QrCode, qrCode => qrCode.schedule)
    qr_codes: QrCode[];

    @OneToMany(() => Attendance, attendance => attendance.schedule)
    attendances: Attendance[];
}
