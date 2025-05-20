import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: UserRole })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    user_image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    date_of_birth?: string;

    @ApiPropertyOptional()
    @IsOptional()
    is_active?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    email_verified?: boolean;
}

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @ApiPropertyOptional({ enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiPropertyOptional()
    @IsOptional()
    user_image?: string;

    @ApiPropertyOptional()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsOptional()
    address?: string;

    @ApiPropertyOptional()
    @IsOptional()
    date_of_birth?: string;

    @ApiPropertyOptional()
    @IsOptional()
    is_active?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    email_verified?: boolean;
}

export class UserResponseDto {
    @ApiProperty()
    user_id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ enum: UserRole })
    role: UserRole;

    @ApiPropertyOptional()
    user_image?: string;

    @ApiPropertyOptional()
    phone?: string;

    @ApiPropertyOptional()
    address?: string;

    @ApiPropertyOptional()
    date_of_birth?: string;

    @ApiPropertyOptional()
    is_active?: boolean;

    @ApiPropertyOptional()
    email_verified?: boolean;

    @ApiPropertyOptional()
    last_login?: Date;

    @ApiProperty()
    created_at: Date;

    @ApiProperty()
    updated_at: Date;
}
