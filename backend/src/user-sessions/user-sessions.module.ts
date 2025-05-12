import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './entities/user-session.entity';
import { UserSessionsController } from './controllers/user-sessions.controller';
import { UserSessionsService } from './services/user-sessions.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserSession]),
        UsersModule
    ],
    controllers: [UserSessionsController],
    providers: [UserSessionsService],
    exports: [UserSessionsService],
})
export class UserSessionsModule { }
