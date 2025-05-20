import { Controller, Post, UseGuards, Request, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { Public } from '../decorators/public.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { User } from '../../users/entities/user.entity';
import { Request as ExpressRequest } from 'express';

@ApiTags('auth')
@Controller('auth')
@Public() // Đặt tất cả các route trong controller này thành public
export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Đăng nhập
     * @param req request object
     * @param loginDto login credentials
     * @returns token and user info
     */
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User successfully logged in'
    })
    @ApiResponse({
        status: HttpStatus.UNAUTHORIZED,
        description: 'Invalid credentials'
    })
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ExpressRequest) {
        // Cast the Express.User to our User type before passing it
        return this.authService.login(req.user as User);
    }

    /**
     * Đăng ký tài khoản mới
     * @param registerDto user registration data
     * @returns token and user info
     */
    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
    @ApiResponse({ status: 201, description: 'Đăng ký thành công.' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
