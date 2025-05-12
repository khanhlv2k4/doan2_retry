import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordReset } from './entities/password-reset.entity';
import { PasswordResetController } from './controllers/password-reset.controller';
import { PasswordResetService } from './services/password-reset.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PasswordReset]),
        UsersModule
    ],
    controllers: [PasswordResetController],
    providers: [PasswordResetService],
    exports: [PasswordResetService],
})
export class PasswordResetModule { }
