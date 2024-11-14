import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';  // Библиотека для работы с Excel

@Injectable()
export class ExcelService {
    private readonly logger = new Logger(ExcelService.name);  // Создаем экземпляр логгера

    async processExcel(file: Express.Multer.File): Promise<any> {
        if (!file) {
            this.logger.error('Файл не был загружен');
            throw new Error('Файл не загружен');
        }

        // Логируем информацию о файле
        this.logger.log(`Загружен файл: ${file.originalname}, размер: ${file.size} байт`);

        try {
            // Обрабатываем файл с использованием библиотеки xlsx
            const workbook = XLSX.read(file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Преобразуем данные в JSON
            const data = XLSX.utils.sheet_to_json(sheet);
            this.logger.log(`Обработано ${data.length} строк из Excel файла`);

            return data;  // Возвращаем данные
        } catch (error) {
            // Логируем ошибку при обработке
            this.logger.error('Ошибка при обработке Excel файла', error.stack);
            throw new Error('Ошибка при обработке Excel файла');
        }
    }
}
