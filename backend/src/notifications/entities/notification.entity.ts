import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NotificationType {
    SYSTEM = 'system',
    ATTENDANCE = 'attendance',
    COURSE = 'course',
    USER = 'user',
}

export enum NotificationStatus {
    UNREAD = 'unread',
    READ = 'read',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    notification_id: number;

    @Column({ name: 'user_id', nullable: true })
    user_id: number;

    @Column({ length: 255, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    message: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
        enumName: 'notification_type', // Use PostgreSQL enum name
        default: NotificationType.SYSTEM,
        nullable: false
    })
    type: NotificationType;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        enumName: 'notification_status', // Use PostgreSQL enum name
        default: NotificationStatus.UNREAD,
        nullable: false
    })
    status: NotificationStatus;

    @Column({ name: 'related_id', nullable: true })
    related_id: number;

    @Column({ name: 'related_type', length: 50, nullable: true })
    related_type: string;

    @Column({ name: 'is_read', default: false })
    is_read: boolean;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    read_at: Date;

    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;

    // Relationships
    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
