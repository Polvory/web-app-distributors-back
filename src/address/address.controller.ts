import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddresses } from './dto.addresses';

@ApiTags('adresses')
@Controller('address')
export class AddressController {
    private readonly logger = new Logger(AddressController.name)

    constructor(
        private readonly AddressService: AddressService
    ) { }

    @ApiOperation({ summary: 'Получить адрес' })
    @ApiResponse({ status: 200, description: 'результат успешного ответа' })
    @Get('get/street')
    @ApiQuery({
        name: 'street',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'archive',
        required: true,
        type: Boolean,
        example: false,
    })
    @ApiQuery({
        name: 'house_number',
        required: false,
        type: Number,
        example: 1,
    })
    @Get('/get')
    async get(
        @Query('archive') archive: boolean,
        @Query('street') street: string,
        @Query('house_number') house_number: number
    ) {
        this.logger.log(`Archive:${archive}, Street: ${street}, House Number: ${house_number}`);
        try {
            const addresses = await this.AddressService.get(archive, street || '', house_number);
            this.logger.log(`Успешное получение адреса:${JSON.stringify(addresses, null, 2)}`)
            return addresses;
        } catch (error) {
            this.logger.error(`Ошибка при получении адреса: ${error.message || error}`, error.stack);
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }


    @ApiOperation({ summary: 'Создаём запись' })
    @Post('create')
    async create(
        @Body() dto: CreateAddresses
    ) {
        try {
            const newAddress = await this.AddressService.create(dto);
            this.logger.log(`Создание нового адреса:  ${JSON.stringify(newAddress, null, 2)}`);
            return newAddress;
        } catch (error) {
            this.logger.error(`Ошибка при создании адреса:  ${JSON.stringify(error, null, 2)}`);
            return { error: 'Failed to create address' };
        }
    }



    @ApiOperation({ summary: 'Редактируем запись' })
    @ApiResponse({ status: 201, description: 'Данные изменены' })
    @ApiResponse({ status: 400, description: 'Ошибка изменения' })
    @Put('edit')
    async edit(@Query('id') id: string, @Body() dto: CreateAddresses) {
        this.logger.log(`Редактируем данные адресов: ${JSON.stringify(id, null, 2)}`);
        this.logger.log(`Передаем${JSON.stringify(dto)}`)
        // return await this.AddressService.editAddress(id, dto)
        try {
            const updatedAddress = await this.AddressService.editAddress(id, dto);
            return updatedAddress;
        } catch (error) {
            this.logger.error(`Ошибка при редактировании адреса: ${JSON.stringify(error, null, 2)}`);
            return { error: 'Не удалось обновить данные адреса' }; // Можно вернуть ответ с ошибкой
        }
    }


    @ApiOperation({ summary: 'Архивируем запись' })
    @ApiResponse({ status: 200, description: 'Запись архивирована' })
    @ApiResponse({ status: 404, description: 'Запись не найдена' })
    @Put('archive')
    async archive(
        @Query('id') id: string,
        @Query('archive') archive: boolean
    ) {
        this.logger.log(`Запрос на архивирование записи: id = ${id}, archive = ${archive}`);
        try {
            const result = await this.AddressService.archiveAddress(id, archive);
            this.logger.log(`Запись успешно архивирована: id = ${id}, archive = ${archive}`);
            return result;
        } catch (error) {
            this.logger.error(`Ошибка архивирования записи: id = ${id}, archive = ${archive}, error = ${JSON.stringify(error, null, 2)}`);
            // Бросаем исключение с детализированным сообщением об ошибке
            throw new HttpException('Ошибка архивирования', HttpStatus.BAD_REQUEST);
        }
    }
}


