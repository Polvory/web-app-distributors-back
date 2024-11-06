import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly JwtAuthService: JwtAuthService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization']
        return true

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Отсутствует токен авторизации');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token is missing');
        }


        try {
            const decoded = this.JwtAuthService.verifyToken(token);
            request.user = decoded; // добавляем пользователя в запрос
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
