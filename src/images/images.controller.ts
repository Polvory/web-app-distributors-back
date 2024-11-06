import { Controller, Delete, HttpException, HttpStatus, Logger, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersService } from '../users/users.service'
import { TasksService } from '../add-task/tasks.service'
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { addImgesToTask } from './images.interface';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
    private readonly logger = new Logger(ImagesController.name)

    constructor(
        private UsersService: UsersService,
        private TasksService: TasksService
    ) { }






    @ApiOperation({ summary: 'Загрузка нескольких картинок' })
    @Post('upload')
    @ApiResponse({ status: 201, description: 'Images successfully uploaded' })
    @ApiResponse({ status: 400, description: 'Invalid file format or upload error' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                },
            },
        },
    })
    @ApiQuery({
        name: 'tg_user_id',
        required: true,
        example: '6935066908', // Значение по умолчанию для Swagger
    })
    @ApiQuery({
        name: 'type_add_id',
        required: true,
        example: "41e1b201-efde-49f7-96d1-7cd8000d0803", // Значение по умолчанию для Swagger
    })
    @ApiQuery({
        name: 'task_id',
        required: true,
        example: "aab0dc22-4c12-4d59-878c-c94c0dd63960", // Значение по умолчанию для Swagger
    })
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
                const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
                callback(null, uniqueSuffix);
            },
        }),
        fileFilter: (req, file, callback) => {
            const allowedTypes = /jpeg|jpg|png|gif/;
            const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimeType = allowedTypes.test(file.mimetype);

            if (extName && mimeType) {
                callback(null, true);
            } else {
                callback(new Error('Only images are allowed'), false);
            }
        },
    }))
    async uploadMultipleImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Query('tg_user_id') tg_user_id: string,
        @Query('type_add_id') type_add_id: string,
        @Query('task_id') task_id: string,
    ) {
        this.logger.log(`Грузим картинки ${tg_user_id}`)
        const user = await this.UsersService.validateUser(tg_user_id); // Валидация пользователя здесь
        const task = await this.TasksService.validate(task_id); // Валидация Таски здесь
        const typeAdd = await this.TasksService.findTasksByTypeAddId(type_add_id, task_id)

        if (!user) {
            this.logger.error(`User not found ${tg_user_id}`)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (!task) {
            this.logger.error(`task not found ${task_id}`)
            throw new HttpException('task not found', HttpStatus.NOT_FOUND);
        }
        if (!typeAdd) {
            this.logger.error(`typeAdd not found ${task_id}`)
            throw new HttpException('typeAdd not found', HttpStatus.NOT_FOUND);
        }
        this.logger.warn('Провалидировали', tg_user_id, task_id, type_add_id)



        const filePaths = files.map(file => {
            this.logger.log(file.filename)
            return file.filename
        });
        this.logger.log(`Images successfully uploaded ${tg_user_id}`)


        const payload: addImgesToTask = {
            task_id: task_id,
            type_add_id: type_add_id,
            tg_user_id: String(user.tg_user_id),
            message: 'Images successfully uploaded',
            files: filePaths,
        }

        return await this.TasksService.addImages(payload)
    }


    @ApiOperation({ summary: 'Удалить картинку' })
    @Delete('/delete/image')
    @ApiResponse({ status: 200, description: 'Удалили изображение' })
    @ApiResponse({ status: 404, description: 'Ошибка удаления картинки' })
    @ApiQuery({
        name: 'task_id',
        required: true,
        example: "aab0dc22-4c12-4d59-878c-c94c0dd63960",
    })
    @ApiQuery({
        name: 'type_add_id',
        required: true,
        example: "41e1b201-efde-49f7-96d1-7cd8000d0803",
    })
    @ApiQuery({
        name: 'image_name',
        required: true,
        example: "3b5b08ec-59d0-4bbb-8112-80ed881278d3.jpg",
    })
    async deleteImage(
        @Query('task_id') task_id: string,
        @Query('type_add_id') type_add_id: string,
        @Query('image_name') image_name: string,
    ) {


        // Путь к файлу в директории uploads
        const filePath = path.join(__dirname, '..', '..', 'uploads', image_name);

        try {
            const deletefromTask = await this.TasksService.removeImage(task_id, type_add_id, image_name)
            this.logger.log(deletefromTask)
            // if (deletefromTask) {
            //     // Проверяем, существует ли файл
            //     if (fs.existsSync(filePath)) {
            //         // Удаляем файл
            //         fs.unlinkSync(filePath);
            //         this.logger.log(`Файл ${image_name} успешно удалён.`);
            //         return { message: 'Image successfully deleted' };
            //     } else {
            //         this.logger.error(`Файл ${image_name} не найден.`);
            //         throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
            //     }
            // }
            return deletefromTask
        } catch (error) {
            this.logger.error(`Ошибка при удалении файла: ${error.message}`);
            throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // Logic for deleting image goes here
    }
}
