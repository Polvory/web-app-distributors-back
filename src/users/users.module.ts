import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './users.model';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    JwtAuthModule,
    SequelizeModule.forFeature([Users]),
  ],
  exports: [UsersService]
})
export class UsersModule { }
