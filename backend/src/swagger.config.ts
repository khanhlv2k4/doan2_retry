import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('QR Attendance System API')
        .setDescription('API Documentation for the QR Code Attendance Tracking System')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('students', 'Student management endpoints')
        .addTag('instructors', 'Instructor management endpoints')
        .addTag('courses', 'Course management endpoints')
        .addTag('attendance', 'Attendance tracking endpoints')
        .addTag('qr-codes', 'QR code generation and validation endpoints')
        .addTag('notifications', 'Notification system endpoints')
        .addTag('reports', 'Reporting and analytics endpoints')
        .addTag('admin', 'Admin dashboard endpoints')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
}
