import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Room } from '../../rooms/entities/room.entity';
import { QrCode } from '../../qr-codes/entities/qr-code.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('schedule')
export class Schedule {
    @PrimaryGeneratedColumn()
    schedule_id: number;

    @Column({ name: 'course_id', nullable: false })
    courseId: number;

    @Column({ name: 'room_id', nullable: true })
    roomId: number;

    @Column({ name: 'day_of_week', length: 10, nullable: false })
    dayOfWeek: string;

    @Column({ name: 'start_time', type: 'time', nullable: false })
    startTime: Date;

    @Column({ name: 'end_time', type: 'time', nullable: false })
    endTime: Date;

    @Column({ name: 'repeat_pattern', length: 50, default: 'weekly' })
    repeatPattern: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => Course, course => course.schedules)
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Room, room => room.schedules)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @OneToMany(() => QrCode, qrCode => qrCode.schedule)
    qrCodes: QrCode[];

    @OneToMany(() => Attendance, attendance => attendance.schedule)
    attendances: Attendance[];
}
