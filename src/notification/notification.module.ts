import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SocketModule } from '../WebSocket/websocket.module';


@Module({
  controllers: [NotificationController],
  imports: [SocketModule],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule { }
