import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(role?: UserRole): Promise<User[]> {
        const query = this.usersRepository.createQueryBuilder('user');

        if (role) {
            query.where('user.role = :role', { role });
        }

        return query.getMany();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { user_id: id } });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Check if email already exists
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(createUserDto.password, salt);

        // Create new user
        const user = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            passwordHash,
            role: createUserDto.role,
            phone: createUserDto.phone,
            address: createUserDto.address,
            dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : null,
        });

        return this.usersRepository.save(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // Update user properties
        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.phone) user.phone = updateUserDto.phone;
        if (updateUserDto.address) user.address = updateUserDto.address;
        if (updateUserDto.dateOfBirth) user.dateOfBirth = new Date(updateUserDto.dateOfBirth);
        if (updateUserDto.isActive !== undefined) user.isActive = updateUserDto.isActive;
        if (updateUserDto.emailVerified !== undefined) user.emailVerified = updateUserDto.emailVerified;

        return this.usersRepository.save(user);
    }

    async updatePassword(id: number, newPassword: string): Promise<void> {
        const user = await this.findOne(id);

        // Hash new password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        user.passwordHash = passwordHash;
        await this.usersRepository.save(user);
    }

    async updateAvatar(id: number, avatarPath: string): Promise<User> {
        const user = await this.findOne(id);

        user.userImage = avatarPath;
        return this.usersRepository.save(user);
    }

    async updateLastLogin(id: number): Promise<void> {
        const user = await this.findOne(id);

        user.lastLogin = new Date();
        await this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }

    async comparePassword(user: User, password: string): Promise<boolean> {
        return bcrypt.compare(password, user.passwordHash);
    }
}
