import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { StudentCourse } from '../../student-courses/entities/student-course.entity';

@Entity('students')
export class Student {
    @PrimaryGeneratedColumn()
    student_id: number;

    @Column()
    user_id: number;

    @Column({ unique: true })
    student_code: string;

    @Column({ nullable: true })
    class_id: number;

    @Column({ nullable: true })
    year_of_admission: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Class)
    @JoinColumn({ name: 'class_id' })
    class: Class;

    @OneToMany(() => Attendance, attendance => attendance.student)
    attendances: Attendance[];

    @OneToMany(() => StudentCourse, studentCourse => studentCourse.student)
    studentCourses: StudentCourse[];
}