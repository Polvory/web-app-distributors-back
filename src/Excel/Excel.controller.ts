import { Controller, Logger, Post, Delete, UploadedFile, Query, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './Excel.service';  // Импортируем сервис

@ApiTags('Excel')  // Используем общий тег для всех операций с Excel
@Controller('excel')
export class ExcelController {
    private readonly logger = new Logger(ExcelController.name);  // Логгер контроллера


    constructor(private readonly excelService: ExcelService) {}

    // Загрузка Excel файла
    @ApiOperation({ summary: 'Загрузка Excel файла' })
    @Post('upload')
    @ApiConsumes('multipart/form-data')  // Указываем, что это multipart/form-data запрос (для загрузки файлов)
    @ApiBody({
        description: 'Загрузите Excel файл',
        schema: {
            type: 'object',  // Тип данных - объект
            properties: {
                file: {
                    type: 'string',  // Тип - строка
                    format: 'binary',  // Формат - бинарный файл
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))  // Интерсептор для загрузки одного файла
    @ApiResponse({ status: 201, description: 'Excel файл успешно загружен и обработан' })
    @ApiResponse({ status: 400, description: 'Ошибка загрузки Excel файла' })
    async uploadExcel(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            this.logger.error('Файл не был загружен');
            throw new HttpException('Файл не загружен', HttpStatus.BAD_REQUEST);
        }

        this.logger.log(`Получен файл: ${file.originalname}, размер: ${file.size} байт`);

        try {
            // Делегируем обработку файла в сервис
            const data = await this.excelService.processExcel(file);

            // this.logger.log(`Обработано ${data.length} строк из Excel файла`);


            return { message: 'Excel файл загружен и обработан', data };
        } catch (error) {
            this.logger.error('Ошибка при загрузке или обработке Excel файла', error.stack);
            throw new HttpException('Ошибка при обработке Excel файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Удаление Excel файла
    @ApiOperation({ summary: 'Удаление Excel файла' })
    @Delete('delete')
    @ApiResponse({ status: 200, description: 'Excel файл успешно удален' })
    @ApiResponse({ status: 404, description: 'Ошибка: файл не найден' })
    @ApiQuery({
        name: 'file_name',
        required: true,
        description: 'Имя Excel файла для удаления',
    })
    async deleteExcel(@Query('file_name') fileName: string) {
        try {
            // Удаляем файл через сервис
            await this.excelService.deleteExcelFile(fileName);
            return { message: 'Excel файл успешно удален' };
        } catch (error) {
            this.logger.error(`Ошибка при удалении файла: ${error.message}`);
            throw new HttpException('Ошибка при удалении файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
