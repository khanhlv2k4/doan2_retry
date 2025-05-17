import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { UsersService } from '../users/services/users.service';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
        private usersService: UsersService,
    ) { }

    async findAll(): Promise<Notification[]> {
        return this.notificationsRepository.find({
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }

    async findByUser(user_id: number): Promise<Notification[]> {
        // Verify user exists
        await this.usersService.findOne(user_id);

        return this.notificationsRepository.find({
            where: { user_id },
            order: { created_at: 'DESC' },
        });
    }

    async findUnreadByUser(user_id: number): Promise<Notification[]> {
        // Verify user exists
        await this.usersService.findOne(user_id);

        return this.notificationsRepository.find({
            where: {
                user_id,
                is_read: false
            },
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Notification> {
        const notification = await this.notificationsRepository.findOne({
            where: { notification_id: id },
            relations: ['user'],
        });

        if (!notification) {
            throw new NotFoundException(`Notification with ID ${id} not found`);
        }

        return notification;
    }

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        // If user_id is provided, verify user exists
        if (createNotificationDto.user_id) {
            await this.usersService.findOne(createNotificationDto.user_id);
        }

        const notification = this.notificationsRepository.create({
            user_id: createNotificationDto.user_id,
            title: createNotificationDto.title,
            message: createNotificationDto.message,
            type: createNotificationDto.type,
            status: NotificationStatus.UNREAD,
            related_id: createNotificationDto.resource_id,
            related_type: createNotificationDto.resource_type,
            is_read: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async createSystemNotification(title: string, message: string, related_id?: number, related_type?: string): Promise<Notification> {
        const notification = this.notificationsRepository.create({
            title,
            message,
            type: NotificationType.SYSTEM,
            status: NotificationStatus.UNREAD,
            related_id,
            related_type,
            is_read: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async createUserNotification(
        user_id: number,
        title: string,
        message: string,
        type: NotificationType = NotificationType.USER,
        related_id?: number,
        related_type?: string
    ): Promise<Notification> {
        // Verify user exists
        await this.usersService.findOne(user_id);

        const notification = this.notificationsRepository.create({
            user_id,
            title,
            message,
            type,
            status: NotificationStatus.UNREAD,
            related_id,
            related_type,
            is_read: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
        const notification = await this.findOne(id);

        // Update notification properties
        if (updateNotificationDto.status) {
            notification.status = updateNotificationDto.status;
        }

        // If status is updated to READ, update isRead and readAt
        if (updateNotificationDto.status === NotificationStatus.READ) {
            notification.is_read = true;
            notification.read_at = new Date();
        }

        return this.notificationsRepository.save(notification);
    }

    async markAsRead(id: number): Promise<Notification> {
        const notification = await this.findOne(id);
        notification.status = NotificationStatus.READ;
        notification.is_read = true;
        notification.read_at = new Date();
        return this.notificationsRepository.save(notification);
    }

    async markAllAsRead(user_id: number): Promise<void> {
        await this.notificationsRepository.update(
            { user_id, is_read: false },
            { is_read: true, status: NotificationStatus.READ, read_at: new Date() }
        );
    }

    async remove(id: number): Promise<void> {
        const notification = await this.findOne(id);
        await this.notificationsRepository.remove(notification);
    } async getUnreadCount(user_id: number): Promise<number> {
        return this.notificationsRepository.count({
            where: {
                user_id,
                is_read: false
            }
        });
    }

    async clearAllForUser(user_id: number): Promise<void> {
        // Mark all notifications as read
        await this.notificationsRepository.update(
            { user_id, is_read: false },
            { is_read: true, read_at: new Date() }
        );
    }
}
