import { Controller, HttpException, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('jwtauth')
@Controller('auth')
export class JwtauthController {
    private readonly logger = new Logger(JwtauthController.name)

    constructor(
        // private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    // @ApiOperation({ summary: 'Логин' })
    // @Post('/login')
    // async login(@Query('tg_user_id') tg_user_id: string) {
    //     this.logger.log(`Логин пользователя ${tg_user_id}`)
    //     const user = await this.usersService.validateUser(tg_user_id)
    //     if (!user) throw new HttpException('Пользовател не нйден', HttpStatus.NOT_FOUND);
    //     const payload = {
    //         tg_user_id: user.tg_user_id,
    //         role: user.role
    //     };
    //     return this.jwtService.sign(payload);
    // }


}
