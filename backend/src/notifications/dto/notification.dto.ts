import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

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

export class CreateNotificationDto {
    @ApiProperty({ example: 1, description: 'User ID to send notification to' })
    @IsNumber()
    user_id: number;

    @ApiProperty({ example: 'New message', description: 'Notification title' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'You have a new message', description: 'Notification content' })
    @IsString()
    message: string;

    @ApiProperty({
        enum: NotificationType,
        example: NotificationType.SYSTEM,
        description: 'Notification type'
    })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiPropertyOptional({ example: 1, description: 'Related resource ID (like course_id)' })
    @IsOptional()
    @IsNumber()
    resource_id?: number;

    @ApiPropertyOptional({ example: { key: 'value' }, description: 'Additional metadata' })
    @IsOptional()
    metadata?: Record<string, any>;
}

export class UpdateNotificationDto {
    @ApiProperty({
        enum: NotificationStatus,
        example: NotificationStatus.READ,
        description: 'New notification status'
    })
    @IsEnum(NotificationStatus)
    status: NotificationStatus;
}

export class NotificationResponseDto {
    @ApiProperty({ example: 1, description: 'Notification ID' })
    notification_id: number;

    @ApiProperty({ example: 1, description: 'User ID that the notification belongs to' })
    user_id: number;

    @ApiProperty({ example: 'New message', description: 'Notification title' })
    title: string;

    @ApiProperty({ example: 'You have a new message', description: 'Notification content' })
    message: string;

    @ApiProperty({
        enum: NotificationType,
        example: NotificationType.SYSTEM,
        description: 'Notification type'
    })
    type: NotificationType;

    @ApiProperty({
        enum: NotificationStatus,
        example: NotificationStatus.UNREAD,
        description: 'Notification status'
    })
    status: NotificationStatus;

    @ApiPropertyOptional({ example: 1, description: 'Related resource ID (like course_id)' })
    resource_id?: number;

    @ApiPropertyOptional({ example: { key: 'value' }, description: 'Additional metadata' })
    metadata?: Record<string, any>;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Record creation timestamp' })
    created_at: Date;

    @ApiProperty({ example: '2025-05-12T10:00:00.000Z', description: 'Record update timestamp' })
    updated_at: Date;
}
