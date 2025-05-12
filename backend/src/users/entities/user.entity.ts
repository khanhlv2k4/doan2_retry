import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Instructor } from '../instructors/entities/instructor.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Log } from '../logs/entities/log.entity';
import { UserSession } from '../user-sessions/entities/user-session.entity';
import { PasswordReset } from '../password-reset/entities/password-reset.entity';
import { QrCode } from '../qr-codes/entities/qr-code.entity';

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
    passwordHash: string;

    @Column({ type: 'enum', enum: UserRole, nullable: false })
    role: UserRole;

    @Column({ name: 'user_image', length: 255, nullable: true })
    userImage: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    dateOfBirth: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'last_login', type: 'timestamp', nullable: true })
    lastLogin: Date;

    @Column({ name: 'email_verified', default: false })
    emailVerified: boolean;

    @Column({ name: 'verification_token', nullable: true })
    verificationToken: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relationships
    @OneToOne(() => Student, student => student.user)
    student: Student;

    @OneToOne(() => Instructor, instructor => instructor.user)
    instructor: Instructor;

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    @OneToMany(() => Log, log => log.user)
    logs: Log[];

    @OneToMany(() => UserSession, userSession => userSession.user)
    sessions: UserSession[];

    @OneToMany(() => PasswordReset, passwordReset => passwordReset.user)
    passwordResets: PasswordReset[];

    @OneToMany(() => QrCode, qrCode => qrCode.createdBy)
    qrCodes: QrCode[];
}
