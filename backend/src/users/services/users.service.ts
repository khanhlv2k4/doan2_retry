import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async comparePassword(user: User, plainPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, user.password_hash);
    }

    async findAll(role?: UserRole): Promise<User[]> {
        if (role) {
            return this.usersRepository.find({
                where: { role }
            });
        }
        return this.usersRepository.find();
    }

    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { user_id: id },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({
            where: { email },
        });

        // Don't throw an exception here, just return the user or null
        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = new User();
        user.name = createUserDto.name;
        user.email = createUserDto.email;
        user.password_hash = await this.hashPassword(createUserDto.password);
        user.role = createUserDto.role || UserRole.STUDENT;
        user.phone = createUserDto.phone ?? null;
        user.address = createUserDto.address ?? null;
        user.user_image = createUserDto.user_image ?? null;

        if (createUserDto.date_of_birth) {
            user.date_of_birth = new Date(createUserDto.date_of_birth);
        }

        user.is_active = createUserDto.is_active !== undefined ? createUserDto.is_active : true;
        user.email_verified = createUserDto.email_verified !== undefined ? createUserDto.email_verified : false;

        return this.usersRepository.save(user);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        if (updateUserDto.name) user.name = updateUserDto.name;
        if (updateUserDto.password) {
            user.password_hash = await this.hashPassword(updateUserDto.password);
        }
        if (updateUserDto.phone !== undefined) user.phone = updateUserDto.phone;
        if (updateUserDto.address !== undefined) user.address = updateUserDto.address;
        if (updateUserDto.user_image !== undefined) user.user_image = updateUserDto.user_image;
        if (updateUserDto.date_of_birth) {
            user.date_of_birth = new Date(updateUserDto.date_of_birth);
        }
        if (updateUserDto.is_active !== undefined) {
            user.is_active = updateUserDto.is_active;
        }
        if (updateUserDto.email_verified !== undefined) {
            user.email_verified = updateUserDto.email_verified;
        }

        return this.usersRepository.save(user);
    }

    async updatePassword(id: number, password: string): Promise<User> {
        const user = await this.findOne(id);

        const salt = await bcrypt.genSalt();
        const password_hash = await bcrypt.hash(password, salt);

        user.password_hash = password_hash;

        return this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }

    async updateLastLogin(id: number): Promise<User> {
        const user = await this.findOne(id);
        user.last_login = new Date();
        return this.usersRepository.save(user);
    }

    async validateUserCredentials(email: string, password: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid credentials');
        }

        return user;
    }
}
