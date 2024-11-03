import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'


@Module({
  imports: [
    JwtAuthModule,
    SequelizeModule.forFeature([Task]),
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule { }
