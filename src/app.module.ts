import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { DbModule } from './DataBase/database.module'
import { UsersModule } from './users/users.module';
// import { BotModule } from './bot/bot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { AuthModule } from './auth/auth.module';
import { TypeAddModule } from './type-add/type-add.module';
import { ImagesModule } from './images/images.module';

// BotModule,
@Module({
  imports: [EventEmitterModule.forRoot(), JwtAuthModule, AddressModule, DbModule, UsersModule, AuthModule, TypeAddModule, ImagesModule],
  controllers: [],

})
export class AppModule { }
