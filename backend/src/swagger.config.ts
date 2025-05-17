import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Attendance QR API')
        .setDescription('API documentation for Attendance QR System')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('students', 'Student management endpoints')
        .addTag('instructors', 'Instructor management endpoints')
        .addTag('courses', 'Course management endpoints')
        .addTag('attendance', 'Attendance management endpoints')
        .addTag('qr-codes', 'QR code generation and management')
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

    // Setup Swagger UI at /api/docs endpoint instead of just /api
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'Attendance QR API Docs',
    });

    // Log Swagger URL to console for easy access during development
    console.log(`Swagger UI available at: ${process.env.BASE_URL || 'http://localhost:' + (process.env.PORT || '3200')}/api/docs`);
}
