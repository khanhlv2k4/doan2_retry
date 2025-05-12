import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST', 'localhost'),
                port: configService.get('DB_PORT', 5433),
                username: configService.get('DB_USER', 'postgres'),
                password: configService.get('DB_PASSWORD', '123456'),
                database: configService.get('DB_NAME', 'attendance_qr'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: configService.get('DB_SYNC', false),
                logging: configService.get('DB_LOGGING', false),
            }),
        }),
    ],
})
export class DatabaseModule { }
