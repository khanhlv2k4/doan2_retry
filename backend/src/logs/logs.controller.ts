import { Controller, Get, Post, Body, Query, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { CreateLogDto, LogResponseDto } from './dto/log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('logs')
@Controller('logs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsController {
    constructor(private readonly logsService: LogsService) { }

    @ApiOperation({ summary: 'Get all logs (admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Returns all logs with pagination',
        type: [LogResponseDto]
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.logsService.findAll({ page, limit });
    }

    @ApiOperation({ summary: 'Get logs for a specific user' })
    @ApiResponse({
        status: 200,
        description: 'Returns user logs with pagination',
        type: [LogResponseDto]
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @Roles(UserRole.ADMIN)
    @Get('user/:userId')
    async findByUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.logsService.findByUser(userId, { page, limit });
    }

    @ApiOperation({ summary: 'Get logs for a specific entity' })
    @ApiResponse({
        status: 200,
        description: 'Returns entity logs',
        type: [LogResponseDto]
    })
    @Roles(UserRole.ADMIN)
    @Get('entity/:entityType/:entityId')
    async findByEntity(
        @Param('entityType') entityType: string,
        @Param('entityId', ParseIntPipe) entityId: number,
    ) {
        return this.logsService.findByEntity(entityType, entityId);
    }

    @ApiOperation({ summary: 'Get logs for a specific action' })
    @ApiResponse({
        status: 200,
        description: 'Returns logs for the specified action with pagination',
        type: [LogResponseDto]
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @Roles(UserRole.ADMIN)
    @Get('action/:action')
    async findByAction(
        @Param('action') action: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ) {
        return this.logsService.findByAction(action, { page, limit });
    }

    @ApiOperation({ summary: 'Create a new log entry' })
    @ApiResponse({
        status: 201,
        description: 'The log has been created successfully',
        type: LogResponseDto
    })
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createLogDto: CreateLogDto) {
        return this.logsService.create(createLogDto);
    }

    @ApiOperation({ summary: 'Delete logs older than specified days (admin only)' })
    @ApiResponse({ status: 200, description: 'Returns the number of deleted logs' })
    @Roles(UserRole.ADMIN)
    @Delete('cleanup/:days')
    async deleteOldLogs(@Param('days', ParseIntPipe) days: number) {
        const deletedCount = await this.logsService.deleteOldLogs(days);
        return { message: `${deletedCount} logs older than ${days} days deleted successfully` };
    }
}
