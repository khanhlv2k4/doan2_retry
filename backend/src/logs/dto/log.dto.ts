import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateLogDto {
    @ApiPropertyOptional({ example: 1, description: 'User ID who performed the action' })
    @IsInt()
    @IsOptional()
    user_id?: number;

    @ApiProperty({ example: 'create', description: 'Action performed (create, update, delete, login, etc.)' })
    @IsString()
    @IsNotEmpty()
    action: string;

    @ApiProperty({ example: 'user', description: 'Type of entity the action was performed on' })
    @IsString()
    @IsNotEmpty()
    entity_type: string;

    @ApiProperty({ example: 123, description: 'ID of the entity the action was performed on' })
    @IsInt()
    @IsNotEmpty()
    entity_id: number;

    @ApiPropertyOptional({ example: { name: 'John Doe', role: 'student' }, description: 'Additional details about the action', type: 'object', additionalProperties: true })
    @IsObject()
    @IsOptional()
    details?: Record<string, any>;

    @ApiPropertyOptional({ example: '192.168.1.1', description: 'IP address of the request' })
    @IsString()
    @IsOptional()
    ip_address?: string;
}

export class LogResponseDto {
    @ApiProperty({ example: 1, description: 'Log ID' })
    log_id: number;

    @ApiPropertyOptional({ example: 1, description: 'User ID who performed the action' })
    user_id?: number;

    @ApiProperty({ example: 'create', description: 'Action performed' })
    action: string;

    @ApiProperty({ example: 'user', description: 'Type of entity' })
    entity_type: string;

    @ApiProperty({ example: 123, description: 'Entity ID' })
    entity_id: number;

    @ApiPropertyOptional({ example: { name: 'John Doe', role: 'student' }, description: 'Additional details about the action', type: 'object', additionalProperties: true })
    details?: Record<string, any>;

    @ApiPropertyOptional({ example: '192.168.1.1', description: 'IP address' })
    ip_address?: string;

    @ApiPropertyOptional({ example: 'Mozilla/5.0...', description: 'User agent string' })
    user_agent?: string;

    @ApiProperty({ example: '2023-06-01T15:00:00Z', description: 'When log was created' })
    created_at: Date;

    @ApiPropertyOptional({
        description: 'User information',
        type: 'object'
    })
    user?: any;
}
