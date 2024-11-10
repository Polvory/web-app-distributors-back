import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createUser, editeBanned, editeRole, editeUser } from './dto/users.dto';
import { UsersService } from './users.service'
import { JwtGuard } from '../guards/AuthGuard'
import { RolesGuard } from '../guards/RolesGuard';
import { Roles } from '../guards/roles.decorator';
import { ADMIN } from '../config/roles';

@ApiTags('users')
@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name)

    constructor(
        private usersService: UsersService
    ) { }

    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @Get('headers')
    getHeaders(@Req() request: Request) {
        console.log('Received headers:', request.headers);
        return request.headers; // Возвращаем заголовки в ответе
    }


    @ApiOperation({ summary: 'Получить всех юзеров' })
    @ApiResponse({ status: 200 })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(ADMIN)
    @Get('/get/all')
    async getCardUsers() {
        try {
            return await this.usersService.getAll()
        } catch (error) {
            this.logger.error('Error get user: ' + error.message);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @ApiOperation({ summary: 'Создать юзера' })
    @ApiResponse({ status: 200, description: 'Новый пользователь создан' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации или создания' })
    // @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    // @UseGuards(JwtGuard, RolesGuard)
    // @Roles(ADMIN)
    @Post('/create')
    async createUsers(@Body() dto: createUser) {
        try {
            this.logger.log(`Пробуем создать юзера ${dto.tg_user_id}`)
            const validate = await this.usersService.validateUser(dto.tg_user_id)
            if (!validate) {
                this.logger.log(`Создаем юзера: ${dto.tg_user_id}`)
                const newUser = await this.usersService.createUser(dto)
                return newUser
            } else {
                throw new HttpException('Ошибка валидации пользователя', HttpStatus.BAD_REQUEST);
            }

        } catch (error) {
            throw new HttpException('Ошибка создания пользователя', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @ApiOperation({ summary: 'Редактировать данные' })
    @ApiResponse({ status: 201, description: 'Данные изменены' })
    @ApiResponse({ status: 400, description: 'Ошибка изменеия' })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtGuard)
    @Put('/edite')
    async editeUsers(@Body() dto: editeUser) {
        try {
            this.logger.log(`Редактируем данные юзера ${dto.tg_user_id}`)
            const validateUser = await this.usersService.validateUser(dto.id)
            if (!validateUser) {
                this.logger.error(`Пользователь не найден: ${dto.tg_user_id}`)
                throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
            }
            const editeUser = await this.usersService.editUser(dto)
            return editeUser

        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ApiOperation({ summary: 'Подтвердить роль' })
    @ApiResponse({ status: 201, description: 'Данные изменены' })
    @ApiResponse({ status: 400, description: 'Ошибка изменеия' })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(ADMIN)
    @Put('/confirm/role')
    async confirmRole(@Query('tg_user_id') tg_user_id: string) {
        try {
            return await this.usersService.confirmRole(tg_user_id)
        } catch (error) {
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @ApiOperation({ summary: 'Редактировать роль юзера' })
    @ApiResponse({ status: 200 })
    @Put('/edite/role')
    async editeRoleUsers(@Body() dto: editeRole) {
        this.logger.log(`Редактируем роль юзера: ${dto.tg_user_id}`)
        return await this.usersService.editUser(dto)
    }


    @ApiOperation({ summary: 'Забанить' })
    @ApiResponse({ status: 200 })
    @Put('/banned')
    async bannedUsers(@Body() dto: editeBanned) {
        this.logger.log(`Банним пользоваетеля: ${dto.tg_user_id}`)
        return await this.usersService.editUser(dto)
    }
}
