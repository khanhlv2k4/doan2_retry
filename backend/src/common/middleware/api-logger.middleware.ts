import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger('API');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';
        const start = Date.now();

        // Log khi nhận request
        this.logger.log(
            `[${method}] ${originalUrl} - ${userAgent}`,
        );

        // Kiểm soát lỗi và thời gian phản hồi
        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length') || 0;
            const duration = Date.now() - start;

            if (statusCode >= 400) {
                this.logger.error(
                    `[${method}] ${originalUrl} - ${statusCode} - ${contentLength} - ${duration}ms`,
                );
            } else {
                this.logger.log(
                    `[${method}] ${originalUrl} - ${statusCode} - ${contentLength} - ${duration}ms`,
                );
            }
        });

        next();
    }
}
