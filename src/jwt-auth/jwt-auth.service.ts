import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
    userService: any;
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: any) {
        return this.jwtService.sign(payload);
    }

    verifyToken(token: string) {
        return this.jwtService.verify(token);
    }

    async isBanned(userId: string): Promise<boolean> {
        const user = await this.userService.findOne(userId); // Получаем пользователя по ID
        return user && user.isBanned; // Предполагаем, что у пользователя есть поле isBanned
    }
}