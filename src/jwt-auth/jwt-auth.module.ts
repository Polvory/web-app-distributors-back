import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { JwtauthController } from './jwt-auth.controller';
import { getJwtConfig } from '../config/jwt.config'


@Module({
    imports: [
        // UsersModule,
        JwtModule.register({
            secret: getJwtConfig().secret, // замените на ваш секретный ключ
            signOptions: { expiresIn: '1h' }, // токен истекает через 1 час
        }),
    ],
    providers: [JwtAuthService],
    controllers: [JwtauthController],
    exports: [JwtModule, JwtAuthService], // экспортируем для использования в других модулях

})
export class JwtAuthModule { }
