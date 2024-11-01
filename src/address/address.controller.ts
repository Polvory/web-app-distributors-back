import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddresses, findAddresses } from './dto.addresses';

@ApiTags('adresses')
@Controller('address')
export class AddressController {
    private readonly logger = new Logger(AddressController.name)

    constructor(
        private readonly AddressService: AddressService
    ) { }

    @ApiOperation({ summary: 'Получить адрес' })
    @ApiResponse({ status: 200 })
    @Get('get/street')
    @ApiQuery({
        name: 'value',
        required: false,
        type: String,
    })
    @ApiQuery({
        name: 'archive',
        required: true,
        type: Boolean,
        example: false,
    })
    @Get('/get')
    async get(@Query('archive') archive: boolean, @Query('street') street: string, @Query('house_number') house_number: number) {
        this.logger.log(`Archive:${archive},Street: ${street}`);
        try {
            const adresses = await this.AddressService.get(archive, street || '', house_number);
            return adresses;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }

    // Задание добавить к get поиск по ключу house_number

    @ApiOperation({ summary: 'Создаём запись' })
    @Post('create')
    async create(@Body() dto: CreateAddresses) {
        try {
            const newAddress = await this.AddressService.create(dto);
            return newAddress;
        } catch (error) {
            console.log(error);
            return { error: 'Failed to create address' };
        }
    }
    // Поиск по значачениям
    // преданм в Qeury либо в Body строку 
    // роут c передачей value
    // Найти совпадения в бд по ключу street и вернуть найденный массив 

    @ApiOperation({ summary: 'Редактируем запись' })
    @ApiResponse({ status: 201, description: 'Данные изменены' })
    @ApiResponse({ status: 400, description: 'Ошибка изменеия' })
    @Put('edit')
    async edit(@Query('id') id: string, @Body() dto: CreateAddresses) {
        this.logger.log(`Редактируем данные адресов ${id}`)
        this.logger.log(`Передаем${JSON.stringify(dto)}`)
        return await this.AddressService.editAddress(id, dto)
    }


    @ApiOperation({ summary: 'Архивируем запись' })
    @ApiResponse({ status: 200, description: 'Запись архивирована' })
    @ApiResponse({ status: 404, description: 'Запись не найдена' })
    @Put('archive')
    async archive(@Query('id') id: string) {
        try {
            return await this.AddressService.archiveAddress(id); // Архивирование записи
        } catch (error) {
            throw new HttpException('Ошибка архивирования', HttpStatus.BAD_REQUEST);
        }
    }
}


