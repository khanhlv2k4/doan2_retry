import { Body, Controller, Post, UseGuards, Request, Get, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from '../users/services/users.service';
import { Request as ExpressRequest } from 'express';
import { UserRole } from '../users/entities/user.entity';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) { }

    @ApiOperation({ summary: 'User login' })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest, @Body() loginDto: LoginDto) {
        return this.authService.login(req.user);
    }

    @Public()
    @ApiOperation({ summary: 'User registration' })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: AuthResponseDto
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        try {
            // Handle user registration
            return await this.authService.register(registerDto);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Returns the current user profile'
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @Get('profile') getProfile(@Request() req: ExpressRequest) {
        return req.user;
    }
}
