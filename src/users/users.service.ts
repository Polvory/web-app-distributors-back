import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Users } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { createUser, editeUser } from './dto/users.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Op } from 'sequelize';
@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name)

    constructor(
        private eventEmitter: EventEmitter2,
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
        this.logger.log(dto)
        const user = await this.UsersRepository.findOne({ where: { id: String(dto.id) } })
        Object.assign(user, dto);
        return await user.save()
    }

    async confirmRole(tg_user_id: string) {
        try {
            this.logger.log(`Подтверждаем роль: ${tg_user_id}`)
            const payload = { tg_user_id: tg_user_id };
            const user = await this.validateUser(tg_user_id)
            if (user) {
                user.validate_role = true
                this.eventEmitter.emit('confirmeRole.event', payload);
                return await user.save()
            } else {
                throw new HttpException('Не удалось подтвердить роль', HttpStatus.BAD_GATEWAY);
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
