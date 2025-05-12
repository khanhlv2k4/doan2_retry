import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/log.dto';

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Log)
        private logsRepository: Repository<Log>,
    ) { }

    async findAll(options?: { limit?: number; page?: number }): Promise<{ logs: Log[], total: number }> {
        const limit = options?.limit || 50;
        const page = options?.page || 1;
        const skip = (page - 1) * limit;

        const [logs, total] = await this.logsRepository.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        });

        return { logs, total };
    }

    async findByUser(userId: number, options?: { limit?: number; page?: number }): Promise<{ logs: Log[], total: number }> {
        const limit = options?.limit || 50;
        const page = options?.page || 1;
        const skip = (page - 1) * limit;

        const [logs, total] = await this.logsRepository.findAndCount({
            where: { userId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        });

        return { logs, total };
    }

    async findByEntity(entityType: string, entityId: number): Promise<Log[]> {
        return this.logsRepository.find({
            where: { entityType, entityId },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByAction(action: string, options?: { limit?: number; page?: number }): Promise<{ logs: Log[], total: number }> {
        const limit = options?.limit || 50;
        const page = options?.page || 1;
        const skip = (page - 1) * limit;

        const [logs, total] = await this.logsRepository.findAndCount({
            where: { action },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        });

        return { logs, total };
    }

    async create(createLogDto: CreateLogDto): Promise<Log> {
        const log = this.logsRepository.create({
            userId: createLogDto.userId,
            action: createLogDto.action,
            entityType: createLogDto.entityType,
            entityId: createLogDto.entityId,
            details: createLogDto.details,
            ipAddress: createLogDto.ipAddress,
            userAgent: createLogDto.userAgent,
        });

        return this.logsRepository.save(log);
    }

    async createLog(
        action: string,
        entityType: string,
        entityId: number,
        details?: Record<string, any>,
        userId?: number,
        ipAddress?: string,
        userAgent?: string,
    ): Promise<Log> {
        const log = this.logsRepository.create({
            userId,
            action,
            entityType,
            entityId,
            details,
            ipAddress,
            userAgent,
        });

        return this.logsRepository.save(log);
    }

    async deleteOldLogs(days: number = 90): Promise<number> {
        const date = new Date();
        date.setDate(date.getDate() - days);

        const result = await this.logsRepository
            .createQueryBuilder()
            .delete()
            .from(Log)
            .where('created_at < :date', { date })
            .execute();

        return result.affected || 0;
    }
}
