import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { DbModule } from './DataBase/database.module'
import { UsersModule } from './users/users.module';
import { BotModule } from './bot/bot.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/AuthGuard';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [EventEmitterModule.forRoot(), JwtAuthModule, AddressModule, DbModule, UsersModule, BotModule, AuthModule],
  controllers: [],

})
export class AppModule { }
