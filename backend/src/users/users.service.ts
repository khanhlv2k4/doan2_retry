import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { user_id: id }
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({
            where: { email }
        });
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        // Check if email already exists
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(createUserDto.password, salt);

        // Create new user
        const newUser = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password_hash,
            role: createUserDto.role,
            phone: createUserDto.phone,
            user_image: createUserDto.user_image,
            address: createUserDto.address,
            date_of_birth: createUserDto.date_of_birth ? new Date(createUserDto.date_of_birth) : undefined,
            is_active: createUserDto.is_active !== undefined ? createUserDto.is_active : true,
        });

        const savedUser = await this.usersRepository.save(newUser);
        return savedUser;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        // Update user properties
        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.phone) user.phone = updateUserDto.phone;
        if (updateUserDto.user_image) user.user_image = updateUserDto.user_image;
        if (updateUserDto.address) user.address = updateUserDto.address;
        if (updateUserDto.date_of_birth)
            user.date_of_birth = new Date(updateUserDto.date_of_birth);

        // Update password if provided
        if (updateUserDto.password) {
            const salt = await bcrypt.genSalt();
            user.password_hash = await bcrypt.hash(updateUserDto.password, salt);
        }

        if (updateUserDto.is_active !== undefined)
            user.is_active = updateUserDto.is_active;

        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
}
