import { Injectable, Logger } from '@nestjs/common';
// import { BotService } from '../bot/bot.service'
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SocketGateway } from '../WebSocket/websocket.gateway'

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private SocketGateway: SocketGateway,
        private eventEmitter: EventEmitter2,
    ) { }

    async sendTaskAddNotification(tg_user_id: string, text: string) {
        // sendNotification.event
        this.logger.log(`Нотификация ${tg_user_id}`)
        this.SocketGateway.handleTestMessage(tg_user_id, text)
        this.eventEmitter.emit('sendNotification.event', {
            tg_user_id: tg_user_id,
            text: text
        });
    }
}
