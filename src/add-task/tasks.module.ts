import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './tasks.model';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module'
import { NotificationModule } from '../notification/notification.module';
import { TypeAddModule } from '../type-add/type-add.module';
import { TypeAddTasks } from './type-add-tasks.model';


@Module({
  imports: [
    NotificationModule,
    JwtAuthModule,
    TypeAddModule,
    SequelizeModule.forFeature([Task, TypeAddTasks]),
    UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule { }
