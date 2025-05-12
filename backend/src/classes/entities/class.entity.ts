import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('classes')
export class Class {
    @PrimaryGeneratedColumn()
    class_id: number;

    @Column({ unique: true })
    class_code: string;

    @Column()
    class_name: string;

    @Column({ nullable: true })
    department: string;

    @Column({ nullable: true })
    head_teacher_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relationships
    @OneToMany(() => Student, student => student.class)
    students: Student[];
}
