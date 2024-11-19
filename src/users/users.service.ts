import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Users } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { createUser, editeBanned, editeUser, editeValidate } from './dto/users.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
import { NotificationService } from '../notification/notification.service'
@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)

    constructor(
        private eventEmitter: EventEmitter2,
        private NotificationService: NotificationService,
        @InjectModel(Users) private UsersRepository: typeof Users,
    ) { }


    async getAll() {
        return await this.UsersRepository.findAll()
    }

    async validateUser(id: string | number) {
        this.logger.log(`Вадидируем юзера: ${id}`)
        const validate = await this.UsersRepository.findOne({
            where: {
                [Op.or]: [
                    { tg_user_id: String(id) },
                    { id: String(id) }
                ]
            }
        })
        this.logger.log(JSON.stringify(validate))
        if (validate) {
            return validate
        } else {
            return false
        }

    }

    async editUser(dto: any) {
        try {
            this.logger.log(`Меняем роль: ${dto.tg_user_id}`)

            const user = await this.validateUser(dto.tg_user_id)
            if (user) {
                Object.assign(user, dto);
                return await user.save()
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }

    async confirmRole(dto: editeValidate) {
        try {
            this.logger.log(`Подтверждаем роль: ${dto.tg_user_id}`)
            const payload = { tg_user_id: dto.tg_user_id };
            const user = await this.validateUser(dto.tg_user_id)
            if (user) {
                user.validate_role = dto.validate
                if (dto.validate) {
                    const message = `\nВаша роль потверждена!`;

                    await this.NotificationService.sendTaskAddNotification(String(dto.tg_user_id), message);

                } else {
                    const message = `\nВаша роль отменена!`;

                    await this.NotificationService.sendTaskAddNotification(String(dto.tg_user_id), message);

                }
                return await user.save()
            } else {
                throw new HttpException('Не удалось подтвердить роль', HttpStatus.BAD_GATEWAY);
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }


    async bannedUsers(dto: editeBanned) {
        try {
            this.logger.log(`Подтверждаем роль: ${dto.tg_user_id}`)
            const payload = { tg_user_id: dto.tg_user_id };
            const user = await this.validateUser(dto.tg_user_id)
            if (user) {
                user.banned = dto.banned
                if (dto.banned) {
                    const message = `\nПоздравляем Вас забанили`;

                    await this.NotificationService.sendTaskAddNotification(String(dto.tg_user_id), message);

                } else {
                    const message = `\nБан снят!`;

                    await this.NotificationService.sendTaskAddNotification(String(dto.tg_user_id), message);

                }
                return await user.save()
            } else {
                throw new HttpException('Не удалось забанить', HttpStatus.BAD_GATEWAY);
            }
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }

    async createUser(dto: createUser) {
        try {
            const newUser = await this.UsersRepository.create(dto)
            return newUser
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }

    async savePhoneNumber(userId: string, phoneNumber: string) {
        const user = await this.validateUser(String(userId))
        this.logger.log(`Записываем номер ${phoneNumber}`)
        if (user) {
            user.phone = phoneNumber
            return await user.save()
        } else {
            return false
        }
    }



}
