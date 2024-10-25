import { Controller, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('adresses')

@Controller('address')
export class AddressController {
    @ApiOperation({ summary: 'Получить адреса' })
    @ApiResponse({ status: 200 })
    @Get('get')
    async get() {
        return 200
    }
    @ApiOperation({ summary: 'Создаём запись' })
    @Post('create')
    async create() {
        return 200
    }

    @ApiOperation({ summary: 'Редактируем запись' })
    @Put('edit')
    async edit() {
        return 200
    }

    @ApiOperation({ summary: 'Архивируем запись' })
    @Put('arhiv')
    async arhiv() {
        return 200
    }

}
