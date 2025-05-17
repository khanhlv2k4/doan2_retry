import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user) {
            return null;
        }

        // Check if user is active
        if (!user.is_active) {
            throw new UnauthorizedException('User account is inactive');
        }

        const isPasswordValid = await this.usersService.comparePassword(user, password);

        if (!isPasswordValid) {
            return null;
        }

        // Update last login
        await this.usersService.updateLastLogin(user.user_id);

        const { password_hash, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = {
            sub: user.user_id,
            email: user.email,
            role: user.role
        };

        return {
            access_token: this.jwtService.sign(payload), // <-- Token is created here
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        // Log input data
        console.log('[REGISTER] Payload:', registerDto);

        // Check if user exists with the same email
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            console.log('[REGISTER] Email already in use:', registerDto.email);
            throw new ConflictException('Email already in use');
        }

        try {
            // Create the user with all provided fields
            const user = await this.usersService.create({
                name: registerDto.name,
                email: registerDto.email,
                password: registerDto.password,
                role: registerDto.role || UserRole.STUDENT,
                phone: registerDto.phone,
                address: registerDto.address,
                date_of_birth: registerDto.date_of_birth,
                user_image: registerDto.user_image,
                is_active: registerDto.is_active !== undefined ? registerDto.is_active : true,
                email_verified: registerDto.email_verified !== undefined ? registerDto.email_verified : false,
            });

            console.log('[REGISTER] User created:', user.user_id, user.email);

            // Generate JWT token for the newly registered user
            return this.login(user);
        } catch (error) {
            console.error('[REGISTER] Error:', error);
            if (error.code === '23505') { // PostgreSQL unique constraint violation
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async validateUserById(userId: number) {
        const user = await this.usersService.findOne(userId); if (!user || !user.is_active) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }
}
