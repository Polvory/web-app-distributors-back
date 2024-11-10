import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TypeAdd } from './type-add.model';
import { createTypeAdd } from './dto/type-add.dto';
import { Op } from 'sequelize';

@Injectable()
export class TypeAddService {
    private readonly logger = new Logger(TypeAddService.name)
    constructor(
        @InjectModel(TypeAdd) private TypeAddRepository: typeof TypeAdd,
    ) { }




    async getAll(archive: boolean, value: string): Promise<TypeAdd[]> {
        this.logger.log('Получаем тип рекламмы')

        this.logger.log(value)
        return await this.TypeAddRepository.findAll({ where: { archive: archive, name: { [Op.iLike]: `%${value}%` } } })
    }


    async validate(id: string): Promise<TypeAdd> {
        return this.TypeAddRepository.findByPk(id)

    }

    async create(dto: createTypeAdd) {
        const newTypeAdd = await this.TypeAddRepository.create(dto)
        if (!newTypeAdd) {
            throw new HttpException('Не удалось создать тип рекламы', HttpStatus.BAD_GATEWAY);
        }
        return newTypeAdd
    }

    async edite(id: string, dto: createTypeAdd) {
        const typeAdd = await this.TypeAddRepository.findOne({ where: { id: id } })
        if (!typeAdd) throw new HttpException('Нет такой рекламы', HttpStatus.NOT_FOUND);
        Object.assign(typeAdd, dto);
        return await typeAdd.save()
    }


}
