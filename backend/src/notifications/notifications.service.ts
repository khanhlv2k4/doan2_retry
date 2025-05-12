import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { UsersService } from '../users/users.service';

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
            order: { createdAt: 'DESC' },
        });
    }

    async findByUser(userId: number): Promise<Notification[]> {
        // Verify user exists
        await this.usersService.findOne(userId);

        return this.notificationsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findUnreadByUser(userId: number): Promise<Notification[]> {
        // Verify user exists
        await this.usersService.findOne(userId);

        return this.notificationsRepository.find({
            where: {
                userId,
                isRead: false
            },
            order: { createdAt: 'DESC' },
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
        // If userId is provided, verify user exists
        if (createNotificationDto.userId) {
            await this.usersService.findOne(createNotificationDto.userId);
        }

        const notification = this.notificationsRepository.create({
            userId: createNotificationDto.userId,
            title: createNotificationDto.title,
            message: createNotificationDto.message,
            type: createNotificationDto.type,
            status: NotificationStatus.UNREAD,
            relatedId: createNotificationDto.relatedId,
            relatedType: createNotificationDto.relatedType,
            isRead: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async createSystemNotification(title: string, message: string, relatedId?: number, relatedType?: string): Promise<Notification> {
        const notification = this.notificationsRepository.create({
            title,
            message,
            type: NotificationType.SYSTEM,
            status: NotificationStatus.UNREAD,
            relatedId,
            relatedType,
            isRead: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async createUserNotification(
        userId: number,
        title: string,
        message: string,
        type: NotificationType = NotificationType.USER,
        relatedId?: number,
        relatedType?: string
    ): Promise<Notification> {
        // Verify user exists
        await this.usersService.findOne(userId);

        const notification = this.notificationsRepository.create({
            userId,
            title,
            message,
            type,
            status: NotificationStatus.UNREAD,
            relatedId,
            relatedType,
            isRead: false,
        });

        return this.notificationsRepository.save(notification);
    }

    async update(id: number, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
        const notification = await this.findOne(id);

        // Update notification properties
        if (updateNotificationDto.status !== undefined) {
            notification.status = updateNotificationDto.status;
        }

        if (updateNotificationDto.isRead !== undefined) {
            notification.isRead = updateNotificationDto.isRead;

            // If marking as read, set the readAt timestamp
            if (updateNotificationDto.isRead) {
                notification.readAt = new Date();
            }
        }

        return this.notificationsRepository.save(notification);
    }

    async markAsRead(id: number): Promise<Notification> {
        const notification = await this.findOne(id);

        notification.isRead = true;
        notification.status = NotificationStatus.READ;
        notification.readAt = new Date();

        return this.notificationsRepository.save(notification);
    }

    async markAllAsRead(userId: number): Promise<void> {
        // Verify user exists
        await this.usersService.findOne(userId);

        await this.notificationsRepository.update(
            { userId, isRead: false },
            {
                isRead: true,
                status: NotificationStatus.READ,
                readAt: new Date()
            }
        );
    }

    async remove(id: number): Promise<void> {
        const notification = await this.findOne(id);
        await this.notificationsRepository.remove(notification);
    }

    async clearAllForUser(userId: number): Promise<void> {
        // Verify user exists
        await this.usersService.findOne(userId);

        const notifications = await this.notificationsRepository.find({
            where: { userId },
        });

        await this.notificationsRepository.remove(notifications);
    }
}
