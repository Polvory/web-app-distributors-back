import { Controller, Logger, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './Excel.service';  // Импортируем сервис

@ApiTags('Excel')
@Controller('Excel')
export class ExcelController {
    private readonly logger = new Logger(ExcelController.name);  // Логгер контроллера

    constructor(private readonly excelService: ExcelService) { }  // Инжектим сервис

    @ApiOperation({ summary: 'Загрузка Excel' })
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))  // Интерсептор для загрузки файла
    @ApiResponse({ status: 201, description: 'Excel загружен' })
    @ApiResponse({ status: 400, description: 'Ошибка загрузки Excel' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            this.logger.error('Файл не был загружен');
            throw new Error('Файл не загружен');
        }

        try {
            // Делегируем обработку файла в сервис
            const data = await this.excelService.processExcel(file);
            this.logger.log(`Обработано ${data.length} строк из Excel файла`);

            return { message: 'Excel загружен и обработан', data };
        } catch (error) {
            this.logger.error('Ошибка при загрузке или обработке Excel файла', error.stack);
            throw new Error('Ошибка при обработке Excel файла');
        }
    }
}
