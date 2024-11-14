import { Module } from '@nestjs/common';
import { ExcelController } from './Excel.controller';
import { ExcelService } from './Excel.service';
import { MulterModule } from '@nestjs/platform-express';
@Module({

    imports: [
        MulterModule.register({
            dest: './uploads',  // Указываем место для временных файлов
        }),
    ],
    providers: [ExcelService],
    controllers: [ExcelController],
})
export class ExcelModule { }