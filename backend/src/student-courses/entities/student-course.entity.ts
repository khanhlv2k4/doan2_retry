import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('student_courses')
export class StudentCourse {
    @PrimaryGeneratedColumn()
    enrollment_id: number;

    @Column()
    student_id: number;

    @Column()
    course_id: number;

    @CreateDateColumn()
    enrollment_date: Date;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    grade: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Student, student => student.studentCourses)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @ManyToOne(() => Course, course => course.studentCourses)
    @JoinColumn({ name: 'course_id' })
    course: Course;
}
