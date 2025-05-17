import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UsersService } from '../services/users.service';
import { UserResponseDto } from '../dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({ status: 200, description: 'Returns the user', type: UserResponseDto })
    @ApiResponse({ status: 404, description: 'User not found' })
    @ApiBearerAuth('JWT-auth')
    async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        const user = await this.usersService.findOne(+id);

        // Exclude sensitive information
        const { password_hash, verification_token, ...userWithoutSensitiveInfo } = user;

        // Map to response DTO with all required fields
        return {
            ...userWithoutSensitiveInfo,
            created_at: user.created_at,
            updated_at: user.updated_at
        } as UserResponseDto;
    }

    // Fix similar issues in other controller methods
}