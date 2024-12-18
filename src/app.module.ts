import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { DbModule } from './DataBase/database.module'
import { UsersModule } from './users/users.module';
import { BotModule } from './bot/bot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { AuthModule } from './auth/auth.module';
import { TypeAddModule } from './type-add/type-add.module';
import { ImagesModule } from './images/images.module';
import { TasksModule } from './add-task/tasks.module'
import { NotificationModule } from './notification/notification.module';
import { ExcelModule } from './Excel/Excel.module';
import { SocketModule } from './WebSocket/websocket.module';
// BotModule,
@Module({
  imports: [EventEmitterModule.forRoot(),
    JwtAuthModule,
    // BotModule,
    ExcelModule,
    AddressModule,
    DbModule,
    UsersModule,
    AuthModule,
    TypeAddModule,
    ImagesModule,
    TasksModule,
    NotificationModule,

    SocketModule

    ExcelModule

  ],
  controllers: [],

})
export class AppModule { }
