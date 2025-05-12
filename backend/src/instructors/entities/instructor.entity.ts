import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity('instructors')
export class Instructor {
    @PrimaryGeneratedColumn()
    instructor_id: number;

    @Column()
    user_id: number;

    @Column()
    department: string;

    @Column({ nullable: true })
    position: string;

    @Column({ nullable: true, type: 'text' })
    specialization: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Course, course => course.instructor)
    courses: Course[];
}
