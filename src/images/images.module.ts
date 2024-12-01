import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../add-task/tasks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtAuthModule } from 'src/jwt-auth/jwt-auth.module';
@Module({
  providers: [ImagesService],
  controllers: [ImagesController],
  imports: [
    JwtAuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // путь к папке с изображениями
      serveRoot: 'distributorsApp/images', // URL префикс для изображений
    }), UsersModule, TasksModule]
})
export class ImagesModule { }
