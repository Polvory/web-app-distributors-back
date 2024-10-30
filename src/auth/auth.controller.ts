import { Controller, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
    @Post('/login')
    async login(@Query('tg_user_id') tg_user_id: string) {
        this.logger.log(`Логин пользователя ${tg_user_id}`)
        const user = await this.usersService.validateUser(tg_user_id)
        if (!user) throw new HttpException('Пользовател не нйден', HttpStatus.NOT_FOUND);

        console.log(user.role)
        const payload = {
            tg_user_id: user.tg_user_id,
            role: user.role
        };
        const token = this.jwtAuthService.generateToken(payload)
        // return `Bearer ${token}`
        return token
        // return this.jwtService.sign(payload);
    }
}
