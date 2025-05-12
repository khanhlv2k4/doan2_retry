import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admin_dashboard')
export class AdminDashboard {
    @PrimaryGeneratedColumn()
    dashboard_id: number;

    @Column()
    total_students: number;

    @Column()
    total_courses: number;

    @Column()
    total_instructors: number;

    @Column()
    total_attendance_records: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    attendance_rate: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    present_rate: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    absent_rate: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    late_rate: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    data_date: Date;

    @CreateDateColumn()
    last_updated: Date;
}
