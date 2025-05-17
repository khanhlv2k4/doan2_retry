import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';

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

    @Column({ type: 'enum', enum: UserRole, nullable: false })
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

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Giữ lại các quan hệ còn hoạt động và loại bỏ các quan hệ không tồn tại
    @OneToOne('Student', 'user')
    student: any;

    @OneToOne('Instructor', 'user')
    instructor: any;

    @OneToMany('Notification', 'user')
    notifications: any[];

    // Loại bỏ các quan hệ tới bảng đã xóa
    /*
    @OneToMany('Log', 'user')
    logs: any[];

    @OneToMany('UserSession', 'user')
    sessions: any[];

    @OneToMany('PasswordReset', 'user')
    password_resets: any[];
    */

    @OneToMany('QrCode', 'created_by_user')
    qr_codes: any[];
}
