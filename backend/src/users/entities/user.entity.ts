import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

// Keep the enum for TypeScript type checking
export enum UserRole {
    ADMIN = 'admin',
    INSTRUCTOR = 'instructor',
    STUDENT = 'student',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ length: 255, nullable: false })
    name: string;

    @Column({ length: 255, unique: true, nullable: false })
    email: string;

    @Column({ name: 'password_hash', nullable: false })
    password_hash: string;

    // Use the SQL-defined enum by specifying the type as a string
    @Column({
        type: 'enum',
        enum: UserRole,
        enumName: 'user_role', // Use the actual PostgreSQL enum name
        nullable: false
    })
    role: UserRole;

    @Column({ name: 'user_image', type: 'varchar', length: 255, nullable: true })
    user_image: string | null;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string | null;

    @Column({ type: 'text', nullable: true })
    address: string | null;

    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    date_of_birth: Date;

    @Column({ name: 'is_active', default: true })
    is_active: boolean;

    @Column({ name: 'last_login', type: 'timestamp', nullable: true })
    last_login: Date;

    @Column({ name: 'email_verified', default: false })
    email_verified: boolean;

    @Column({ name: 'verification_token', nullable: true })
    verification_token: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    department: string | null;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relationships
    @OneToOne('Student', 'user')
    student: any;

    @OneToOne('Instructor', 'user')
    instructor: any;

    @OneToMany('Notification', 'user')
    notifications: any[];

    @OneToMany('QrCode', 'created_by_user')
    qr_codes: any[];
}
