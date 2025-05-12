import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';

@Entity('semesters')
export class Semester {
    @PrimaryGeneratedColumn()
    semester_id: number;

    @Column({ unique: true })
    semester_code: string;

    @Column()
    semester_name: string;

    @Column()
    start_date: Date;

    @Column()
    end_date: Date;

    @Column({ default: true })
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relationships
    @OneToMany(() => Course, course => course.semester)
    courses: Course[];
}
