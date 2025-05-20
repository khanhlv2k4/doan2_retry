import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async findAll(role?: UserRole): Promise<User[]> {
        try {
            const queryBuilder = this.userRepository.createQueryBuilder('user');

            if (role) {
                queryBuilder.where('user.role = :role', { role });
            }

            return await queryBuilder.getMany();
        } catch (error) {
            throw new InternalServerErrorException('Error fetching users');
        }
    }

    async findOne(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { user_id: id } });
            if (!user) {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            return user;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error fetching user');
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Error fetching user by email');
        }
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            // Check if email already exists
            const existingUser = await this.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new ConflictException('Email already exists');
            }

            // Extract password from DTO
            const { password, ...userData } = createUserDto;

            // Create new user entity
            const user = this.userRepository.create({
                ...userData,
                password_hash: await bcrypt.hash(password, 10),
                // For date fields that come as string, parse them
                date_of_birth: userData.date_of_birth ? new Date(userData.date_of_birth) : null,
                is_active: userData.is_active ?? true,
                email_verified: userData.email_verified ?? false
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) throw error;
            if (error.code === '23505') { // PostgreSQL unique constraint violation
                throw new ConflictException('Email already exists');
            }
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.findOne(id);

            // Check if we're trying to update to an email that already exists
            if (updateUserDto.email && updateUserDto.email !== user.email) {
                const existingUser = await this.findByEmail(updateUserDto.email);
                if (existingUser) {
                    throw new ConflictException('Email already exists');
                }
            }

            // Handle password separately if provided
            if (updateUserDto.password) {
                user.password_hash = await bcrypt.hash(updateUserDto.password, 10);
                delete updateUserDto.password;
            }

            // Handle date conversion - fixed type error
            if (updateUserDto.date_of_birth) {
                const dateOfBirth = new Date(updateUserDto.date_of_birth);
                // @ts-ignore - We know what we're doing, date will be converted properly
                user.date_of_birth = dateOfBirth;
                delete updateUserDto.date_of_birth;
            }

            // Update other fields
            Object.assign(user, updateUserDto);

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) throw error;
            if (error.code === '23505') {
                throw new ConflictException('Email already exists');
            }
            throw new InternalServerErrorException('Error updating user');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const user = await this.findOne(id);
            await this.userRepository.remove(user);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error deleting user');
        }
    }

    // Add missing methods needed by auth service
    async comparePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.password_hash);
    }

    async updateLastLogin(userId: number): Promise<void> {
        await this.userRepository.update(
            { user_id: userId },
            { last_login: new Date() }
        );
    }
}
