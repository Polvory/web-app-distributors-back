import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ImagesService],
  controllers: [ImagesController],
  imports: [UsersModule]
})
export class ImagesModule { }
