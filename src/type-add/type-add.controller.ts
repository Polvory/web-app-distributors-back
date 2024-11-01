import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TypeAddService } from './type-add.service'
import { createTypeAdd } from './dto/type-add.dto';
import { Roles } from '../guards/roles.decorator';
import { ADMIN } from '../config/roles';
import { JwtGuard } from '../guards/AuthGuard';
import { RolesGuard } from '../guards/RolesGuard';

@ApiTags('Типы рекламы')
@Controller('type-add')
export class TypeAddController {
    private readonly logger = new Logger(TypeAddController.name)

    constructor(
        private TypeAddService: TypeAddService
    ) { }

    @ApiOperation({ summary: 'Получить типы рекламы' })
    @ApiBearerAuth('JWT')
    @UseGuards(JwtGuard)
    @ApiQuery({
        name: 'archive',
        required: true,
        type: Boolean,
        example: false, // Значение по умолчанию для Swagger
    })
    @ApiQuery({
        name: 'value',
        required: false,
        type: String,
    })
    @Get('/get/all')
    async getAll(@Query('archive') archive: boolean, @Query('value') value: string) {
        this.logger.log(`Archive: ${archive}, Value: ${value}`);
        
        try {
            const typeAdds = await this.TypeAddService.getAll(archive, value || '');
            return typeAdds;
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }
    


    @ApiOperation({ summary: 'Создать тип рекламы' })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(ADMIN)
    @Post('/create')
    async create(@Body() dto: createTypeAdd) {
        try {
            const newTypeAdd = await this.TypeAddService.create(dto)
            return newTypeAdd
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);

        }
    }

    @ApiOperation({ summary: 'Реадктировтаь тип рекламы' })
    @ApiBearerAuth('JWT') // Указываем, что используем Bearer token с именем 'JWT'
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(ADMIN)
    @Put('/edite')
    async edite(@Query('id') id: string, @Body() dto: createTypeAdd) {
        try {
            const editeTypeAdd = await this.TypeAddService.edite(id, dto)
            return editeTypeAdd
        } catch (error) {
            throw new HttpException(error, HttpStatus.BAD_GATEWAY);

        }
    }



}
