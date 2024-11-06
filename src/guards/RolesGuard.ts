import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return true

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userRole = request.user['role'] || request.user.role; // Получаем id из заголовка или параметров запроса
        // console.log(request.user['role'])
        if (!userRole) {
            throw new UnauthorizedException('User Role is missing');
        }

        // Проверяем, есть ли у пользователя необходимая роль
        const hasRole = requiredRoles.includes(userRole);

        if (!hasRole) {
            throw new UnauthorizedException('User does not have required roles');
        }

        return true;
    }
}
