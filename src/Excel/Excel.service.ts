import { Injectable, Logger } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ExcelService {
    private readonly logger = new Logger(ExcelService.name);

    async processExcel(file: Express.Multer.File) {
        const buffer = file.buffer;

        // Логирование данных о файле
        this.logger.log(`Загружен файл: ${file.originalname}, размер: ${file.size} байт`);

        try {
            // Проверка типа загруженного файла
            if (!file.mimetype.includes('excel') && !file.mimetype.includes('spreadsheetml')) {
                this.logger.error('Неверный формат файла');
                throw new HttpException('Неверный формат файла. Пожалуйста, загрузите файл Excel.', HttpStatus.BAD_REQUEST);
            }

            // Логируем часть содержимого буфера для диагностики
            this.logger.log(`Размер буфера файла: ${buffer.length} байт`);
            this.logger.log(`Частичное содержимое буфера: ${buffer.slice(0, 100).toString('utf8')}`);

            // Чтение файла

            this.logger.log('Чтение файла с помощью xlsx.read...');
            const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true, cellText: false });

            // Логируем содержимое workbook для диагностики
            this.logger.log(`Содержимое workbook: ${JSON.stringify(workbook)}`);

            // Проверка наличия листов в рабочей книге
            if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
                this.logger.error('Файл не содержит листов');
                throw new HttpException('Файл не содержит листов', HttpStatus.BAD_REQUEST);
            }

            // Логируем имена листов
            this.logger.log(`Имена листов: ${JSON.stringify(workbook.SheetNames)}`);

            // Выбираем первый лист
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Проверка наличия листа
            if (!sheet) {
                this.logger.error(`Лист ${sheetName} не найден`);
                throw new HttpException('Лист не найден в файле', HttpStatus.BAD_REQUEST);
            }

            // Преобразуем данные из листа в JSON
            this.logger.log(`Преобразуем данные с листа ${sheetName} в JSON...`);
            const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

            // Проверка на пустые данные
            if (!data || data.length === 0) {
                this.logger.error('Лист пуст.');
                throw new HttpException('Лист пуст.', HttpStatus.BAD_REQUEST);
            }

            this.logger.log(`Обработано ${data.length} строк из Excel файла`);

            return data;
        } catch (error) {
            // Логируем ошибку
            this.logger.error('Ошибка при обработке Excel файла:', error.message);
            throw new HttpException('Ошибка при обработке Excel файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Метод для удаления файла (заглушка)
    async deleteExcelFile(fileName: string) {
        // Здесь может быть реальная логика удаления файла
        this.logger.log(`Файл ${fileName} успешно удален`);
        return { message: `Файл ${fileName} удален` };
    }
}
