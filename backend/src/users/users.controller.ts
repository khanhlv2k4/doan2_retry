import {
    Body, Controller, Delete, Get, Param, Patch, Post,
    ParseIntPipe, Query, UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { User, UserRole } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({
        status: 200,
        description: 'Returns all users',
        type: [UserResponseDto]
    })
    @ApiQuery({
        name: 'role',
        enum: UserRole,
        required: false,
        description: 'Filter users by role'
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get()
    async findAll(@Query('role') role?: UserRole): Promise<UserResponseDto[]> {
        const users = await this.usersService.findAll(role);
        return users.map(user => this.mapToResponseDto(user));
    }

    @ApiOperation({ summary: 'Get a specific user by ID' })
    @ApiResponse({
        status: 200,
        description: 'Returns the user information',
        type: UserResponseDto
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        const user = await this.usersService.findOne(id);
        return this.mapToResponseDto(user);
    }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({
        status: 201,
        description: 'The user has been created successfully',
        type: UserResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request (e.g., email already exists)' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.usersService.create(createUserDto);
        return this.mapToResponseDto(user);
    }

    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({
        status: 200,
        description: 'The user has been updated successfully',
        type: UserResponseDto
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        const user = await this.usersService.update(id, updateUserDto);
        return this.mapToResponseDto(user);
    }

    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 204, description: 'The user has been deleted successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.usersService.remove(id);
    }

    private mapToResponseDto(user: User): UserResponseDto {
        const { passwordHash, verificationToken, ...userWithoutSensitiveInfo } = user;
        return userWithoutSensitiveInfo as UserResponseDto;
    }
}
