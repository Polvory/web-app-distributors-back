

import { UsersModule } from '../users/users.module';
import { TasksModule } from '../add-task/tasks.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { ExcelService } from './Excel.service';
import { ExcelController } from './Excel.controller';



@Module({
    providers: [ExcelService],
    controllers: [ExcelController],
    imports: []
})
export class ExcelModule { }

