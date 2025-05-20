import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    /**
     * Custom handler for better error handling
     */
    handleRequest<TUser = any>(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
        status?: any
    ): TUser {
        // Throw an exception if error occurred
        if (err || !user) {
            throw err || new UnauthorizedException('Invalid email or password');
        }

        return user;
    }
}
