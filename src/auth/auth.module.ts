import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UsersModule, JwtAuthModule]
})
export class AuthModule { }
