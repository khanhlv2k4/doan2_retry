import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
// Don't import the conflicting controller from controllers folder

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController], // Only include the main controller
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
