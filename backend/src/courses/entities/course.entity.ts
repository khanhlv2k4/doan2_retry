import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Instructor } from '../../instructors/entities/instructor.entity';
import { Semester } from '../../semesters/entities/semester.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { StudentCourse } from '../../student-courses/entities/student-course.entity';
import { QrCode } from '../../qr-codes/entities/qr-code.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column({ name: 'course_name', length: 255, nullable: false })
    course_name: string;

    @Column({ name: 'course_code', length: 50, unique: true, nullable: false })
    course_code: string;

    @Column({ name: 'instructor_id', nullable: false })
    instructor_id: number;

    @Column({ name: 'semester_id', nullable: true })
    semester_id: number;

    @Column({ name: 'start_date', type: 'date', nullable: false })
    start_date: Date;

    @Column({ name: 'end_date', type: 'date', nullable: false })
    end_date: Date;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 3, nullable: false })
    credits: number;

    @Column({ name: 'academic_year', length: 20, nullable: true })
    academic_year: string;

    @Column({ name: 'is_active', default: true })
    is_active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relationships
    @ManyToOne(() => Instructor, instructor => instructor.courses)
    @JoinColumn({ name: 'instructor_id' })
    instructor: Instructor;

    @ManyToOne(() => Semester, semester => semester.courses)
    @JoinColumn({ name: 'semester_id' })
    semester: Semester;

    @OneToMany(() => Schedule, schedule => schedule.course)
    schedules: Schedule[];

    @OneToMany(() => StudentCourse, studentCourse => studentCourse.course)
    studentCourses: StudentCourse[];

    @OneToMany(() => QrCode, qrCode => qrCode.course)
    qrCodes: QrCode[];

    @OneToMany(() => Attendance, attendance => attendance.course)
    attendances: Attendance[];
}
