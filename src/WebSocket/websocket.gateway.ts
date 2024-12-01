import { Logger } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        // path: '/socket.io', // Указываем путь для сокетов
        origin: '*', // Разрешить доступ с любых источников
    },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

    private readonly logger = new Logger(SocketGateway.name)
    constructor() {
        this.logger.warn('WebSocket Gateway initialized');
    }
    @WebSocketServer()
    server: Server;

    // Словарь для связи tg_user_id и client.id
    private userMap: Map<string, string> = new Map();

    handleConnection(client: Socket) {
        const tg_user_id = client.handshake.query.tg_user_id as string; // Получаем tg_user_id

        if (tg_user_id) {
            this.userMap.set(tg_user_id, client.id); // Сохраняем связь tg_user_id -> client.id
            this.logger.warn(`User connected: tg_user_id=${tg_user_id}, client.id=${client.id}`);
        } else {
            this.logger.error(`Connection attempted without tg_user_id: client.id=${client.id}`);
        }
    }

    handleDisconnect(client: Socket) {
        const tg_user_id = Array.from(this.userMap.entries())
            .find(([_, socketId]) => socketId === client.id)?.[0];
        if (tg_user_id) {
            this.userMap.delete(tg_user_id); // Удаляем связь
            this.logger.warn(`User disconnected: tg_user_id=${tg_user_id}, client.id=${client.id}`);
        }
    }

    // Функция для отправки сообщения пользователю по tg_user_id
    sendMessageToUser(tg_user_id: string, message: string) {
        const clientId = this.userMap.get(tg_user_id);
        if (clientId) {
            const clientSocket = this.server.sockets.sockets.get(clientId);
            if (clientSocket) {
                clientSocket.emit('sendTestMessage', message); // Отправляем сообщение
                this.logger.log(`Message sent to tg_user_id=${tg_user_id}: ${message}`);
            } else {
                this.logger.warn(`Client not found for tg_user_id=${tg_user_id}`);
            }
        } else {
            this.logger.warn(`No user found for tg_user_id=${tg_user_id}`);
        }
    }

    // @SubscribeMessage('sendTestMessage')
    handleTestMessage(tg_user_id: string, message: string) {
        // Отправляем тестовое сообщение при получении события 'sendTestMessage'
        // const message = 'This is a test message';
        this.sendMessageToUser(tg_user_id, message);
    }
}
