import { Injectable, Logger } from "@nestjs/common";
import { Action, On, Start, Update } from "nestjs-telegraf";
import { getBotConfig } from "../config/tg.config";
import { Context, Markup, Telegram } from "telegraf";
import { UsersService } from '../users/users.service'
import { OnEvent } from '@nestjs/event-emitter';
import { error } from "console";

@Update()
@Injectable()
export class BotService {
    private readonly logger = new Logger(BotService.name)
    bot: Telegram
    constructor(
        private usersService: UsersService
    ) {
        this.bot = new Telegram(getBotConfig().token)
    }

    // Привет пользователь
    // Выбери роль (роль в последствие будет подтверждена администратором)
    // Доступ к номеру

    // Заполнить данные - в бд будем чекать 
    // Инциализация пользователя или создание
    @Start()
    async startCommand(ctx: Context) {
        const ctx_data: any = ctx.update
        const userId = String(ctx_data.message.from.id)
        // валидируем юзера
        this.logger.log(`Валидируем юзера: ${userId}`)
        const validate = await this.usersService.validateUser(userId)
        this.logger.log(`Результат валидации юзера: ${userId} - ${JSON.stringify(validate)}`)
        if (!validate) {
            const payloud = {
                tg_user_id: userId,
                tg_user_name: ctx_data.message.from.username || null,
            }
            const newUser = await this.usersService.createUser(payloud)
            if (newUser) {
                ctx.sendMessage(`Привет !`,
                    Markup.keyboard([
                        Markup.button.contactRequest("Отправить номер телефона")
                    ]).oneTime()
                        .resize())
            } else {
                ctx.sendMessage(`Ошибка!`)
            }
        } else {
            ctx.sendMessage('С возврашением!')
        }
    }

    @OnEvent('confirmeRole.event')
    handleYourEvent(payload: any) {
        try {
            this.logger.log(`Подтверждение роли бот`)
            console.log('Событие получено:', payload);
            this.bot.sendMessage(payload.tg_user_id, 'Ваша роль подтверждена!').catch((error) => {
                this.logger.error(error)
            })
        } catch (error) {
            this.logger.error(error)
        }
    }
    // Обработчик события contact для отслеживания номера телефона
    @On('contact')
    async onContact(ctx: Context) {
        const ctx_data: any = ctx.update;
        const userId = String(ctx_data.message.from.id);
        const phoneNumber = ctx_data.message.contact.phone_number;

        this.logger.log(`Получен номер телефона от пользователя: ${userId} - ${phoneNumber}`);

        // Сохраняем номер телефона в базе данных
        const savePhoneNamber = await this.usersService.savePhoneNumber(userId, phoneNumber);
        if (savePhoneNamber) {
            ctx.reply(`Спасибо! Ваш номер телефона успешно получен. Выбери роль:`,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback('Админ', 'send_role:Admin'),
                        Markup.button.callback('Исполнитель', 'send_role:User'),
                    ],
                ])

            );
        } else {
            ctx.reply(`Не удалсь сохрнаить номер телефона, попробуй еще раз!`,
                Markup.keyboard([
                    Markup.button.contactRequest("Отправить номер телефона")
                ]).oneTime()
                    .resize());

        }
    }
    return_query(ctx: Context) {
        const cbQuery = JSON.parse(JSON.stringify(ctx.update));
        const data = cbQuery.callback_query.data.split(':')
        return data[1]
    }

    // @Action(/send_role:.+/)
    // async sendRole(ctx: Context) {
    //     try {
    //         const ctx_update: any = ctx.update
    //         const user_id = String(ctx_update.callback_query.from.id)
    //         let query = await this.return_query(ctx)
    //         this.logger.log(`Пользоваетль выберает роль: ${user_id}`)
    //         this.logger.log(`Роль: ${query}`)
    //     } catch (error) {
    //         this.logger.error(error)
    //     }


    // }
    @Action(/send_role:.+/)
    async sendRole(ctx: Context) {
        const ctx_update: any = ctx.update
        const user_id = String(ctx_update.callback_query.from.id)
        this.logger.log(`Обработка callback_query: ${JSON.stringify(ctx.update)}`);
        let query = await this.return_query(ctx)
        this.logger.log(`Пользоваетль выберает роль: ${user_id}`)
        this.logger.log(`Роль: ${query}`)
        const payloud = {
            tg_user_id: user_id,
            role: query
        }
        const saveRole = await this.usersService.editUser(payloud)
        if (!saveRole) {
            ctx.sendMessage('Ошибка! Попробуй выбрать еще раз')
        } else {
            ctx.deleteMessage()
            ctx.sendMessage('Роль успешно выбранна, в скором времени администратор потвердит ее)')

        }
        // остальной код
    }



}