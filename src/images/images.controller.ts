import { Controller, HttpException, HttpStatus, Logger, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersService } from '../users/users.service'
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@ApiTags('Images')
@Controller('images')
export class ImagesController {
    private readonly logger = new Logger(ImagesController.name)

    constructor(
        private UsersService: UsersService
    ) { }

    @Post('upload')
    @ApiOperation({ summary: 'Upload multiple images' })
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
        @Query('tg_user_id') tg_user_id: string
    ) {
        this.logger.log(`Грузим картинки ${tg_user_id}`)
        const user = await this.UsersService.validateUser(tg_user_id); // Валидация пользователя здесь
        if (!user) {
            this.logger.error(`User not found ${tg_user_id}`)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        const filePaths = files.map(file => file.path);
        this.logger.log(`Images successfully uploaded ${tg_user_id}`)

        return {
            tg_user_id: user.tg_user_id,
            message: 'Images successfully uploaded',
            files: filePaths,
        };
    }

}
