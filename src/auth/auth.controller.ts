import { Controller, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service'
import { JwtAuthService } from '../jwt-auth/jwt-auth.service';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name)
    constructor(
        private usersService: UsersService,
        private jwtAuthService: JwtAuthService
    ) { }

    @ApiOperation({ summary: 'Логин' })
    @ApiQuery({
        name: 'tg_user_id',
        required: true,
        type: String,
        example: '6935066908', // Значение по умолчанию для Swagger
    })

    @Post('/login')
    async login(@Query('tg_user_id') tg_user_id: string) {
        this.logger.log(`Логин пользователя ${tg_user_id}`)
        const user = await this.usersService.validateUser(tg_user_id)
        if (!user) throw new HttpException('Пользовател не нйден', HttpStatus.NOT_FOUND);

        if (user.banned) {
            throw new HttpException('Пользователь забанен', HttpStatus.FORBIDDEN); // Блокируем доступ
        }

        console.log(user.role)

        const payload = {
            tg_user_id: user.tg_user_id,
            role: user.role
        };
        const token = this.jwtAuthService.generateToken(payload)
        return token
    }
}
