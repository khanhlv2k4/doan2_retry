import {
    Controller, Get, Post, Body, Patch, Param, Delete,
    UseGuards, ParseIntPipe, Query
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import {
    CreateNotificationDto, UpdateNotificationDto, NotificationResponseDto
} from './dto/notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @ApiOperation({ summary: 'Get all notifications (admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Returns all notifications',
        type: [NotificationResponseDto]
    })
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll() {
        return this.notificationsService.findAll();
    }

    @ApiOperation({ summary: 'Get notifications for a specific user' })
    @ApiResponse({
        status: 200,
        description: 'Returns user notifications',
        type: [NotificationResponseDto]
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get('user/:userId')
    async findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.notificationsService.findByUser(userId);
    }

    @ApiOperation({ summary: 'Get unread notifications for a specific user' })
    @ApiResponse({
        status: 200,
        description: 'Returns unread user notifications',
        type: [NotificationResponseDto]
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get('user/:userId/unread')
    async findUnreadByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.notificationsService.findUnreadByUser(userId);
    }

    @ApiOperation({ summary: 'Get a specific notification by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the notification',
        type: NotificationResponseDto
    })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.notificationsService.findOne(id);
    }

    @ApiOperation({ summary: 'Create a new notification' })
    @ApiResponse({
        status: 201,
        description: 'The notification has been created successfully',
        type: NotificationResponseDto
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Post()
    async create(@Body() createNotificationDto: CreateNotificationDto) {
        return this.notificationsService.create(createNotificationDto);
    }

    @ApiOperation({ summary: 'Create a system notification (admin only)' })
    @ApiResponse({
        status: 201,
        description: 'The system notification has been created successfully',
        type: NotificationResponseDto
    })
    @Roles(UserRole.ADMIN)
    @Post('system')
    async createSystemNotification(
        @Body() createDto: { title: string; message: string; relatedId?: number; relatedType?: string; }
    ) {
        return this.notificationsService.createSystemNotification(
            createDto.title,
            createDto.message,
            createDto.relatedId,
            createDto.relatedType
        );
    }

    @ApiOperation({ summary: 'Create a notification for a specific user' })
    @ApiResponse({
        status: 201,
        description: 'The user notification has been created successfully',
        type: NotificationResponseDto
    })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
    @Post('user/:userId')
    async createUserNotification(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() createDto: {
            title: string;
            message: string;
            type?: string;
            relatedId?: number;
            relatedType?: string;
        }
    ) {
        return this.notificationsService.createUserNotification(
            userId,
            createDto.title,
            createDto.message,
            createDto.type as any,
            createDto.relatedId,
            createDto.relatedType
        );
    }

    @ApiOperation({ summary: 'Update a notification' })
    @ApiResponse({
        status: 200,
        description: 'The notification has been updated successfully',
        type: NotificationResponseDto
    })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateNotificationDto: UpdateNotificationDto
    ) {
        return this.notificationsService.update(id, updateNotificationDto);
    }

    @ApiOperation({ summary: 'Mark a notification as read' })
    @ApiResponse({
        status: 200,
        description: 'The notification has been marked as read',
        type: NotificationResponseDto
    })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Patch(':id/read')
    async markAsRead(@Param('id', ParseIntPipe) id: number) {
        return this.notificationsService.markAsRead(id);
    }

    @ApiOperation({ summary: 'Mark all notifications as read for a user' })
    @ApiResponse({
        status: 200,
        description: 'All notifications have been marked as read'
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Patch('user/:userId/read-all')
    async markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
        await this.notificationsService.markAllAsRead(userId);
        return { message: 'All notifications marked as read' };
    }

    @ApiOperation({ summary: 'Delete a notification' })
    @ApiResponse({ status: 204, description: 'The notification has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'Notification not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.notificationsService.remove(id);
        return { message: 'Notification deleted successfully' };
    }

    @ApiOperation({ summary: 'Clear all notifications for a user' })
    @ApiResponse({ status: 204, description: 'All notifications have been cleared' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
    @Delete('user/:userId')
    async clearAllForUser(@Param('userId', ParseIntPipe) userId: number) {
        await this.notificationsService.clearAllForUser(userId);
        return { message: 'All notifications cleared successfully' };
    }
}
