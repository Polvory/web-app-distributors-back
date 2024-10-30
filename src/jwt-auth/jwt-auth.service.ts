import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) { }

    generateToken(payload: any) {
        return this.jwtService.sign(payload);
    }

    verifyToken(token: string) {
        return this.jwtService.verify(token);
    }
}