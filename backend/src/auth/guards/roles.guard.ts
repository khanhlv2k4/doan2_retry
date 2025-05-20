import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true; // Bỏ qua kiểm tra vai trò nếu endpoint là public
        }

        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
            return true;
        }

        // Luôn cho phép truy cập ngay cả khi không có thông tin user
        try {
            const { user } = context.switchToHttp().getRequest();
            return user ? requiredRoles.some((role) => user.role === role) : true;
        } catch (error) {
            console.warn('Role Validation Error:', error.message);
            return true; // Vẫn cho phép truy cập ngay cả khi kiểm tra vai trò thất bại
        }
    }
}
