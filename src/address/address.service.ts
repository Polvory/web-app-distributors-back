import { Logger, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAddresses } from './dto.addresses';
import { Addresses } from './address.model'
import { Op, where } from 'sequelize';
@Injectable()
export class AddressService {
    private readonly logger = new Logger(AddressService.name)

    constructor(@InjectModel(Addresses) private AddressRepository: typeof Addresses) {
    }



    async create(dto: CreateAddresses) {
        console.log(dto);
        try {
            const new_address = await this.AddressRepository.create(dto);
            return new_address;
        } catch (error) {
            console.log(error);
            throw new HttpException('Ошибка создания записи', HttpStatus.BAD_REQUEST);
        }
    }

    async get(archive: boolean, street: string, house_number: number) {
        this.logger.log(`Поиск по улице: ${street}, архив: ${archive}, номер дома: ${house_number}`);
        try {
            return await this.AddressRepository.findAll({
                where: {
                    archiving_an_address: archive,
                    street: { [Op.iLike]: `%${street}%` }, // Поиск по части строки
                    house_number: { [Op.eq]: house_number } // Точное совпадение номера дома
                },
            });
        } catch (error) {
            throw new HttpException('Ошибка при получении записей', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async editAddress(id: string, dto: any) {
        try {
            this.logger.log(`Редактируем адрес с ID: ${id}`)
            const newAddress = await this.AddressRepository.findOne({ where: { id } })
            this.logger.log(JSON.stringify(newAddress))
            console.log(newAddress)
            if (!newAddress) {
                throw new HttpException('запись не найдена', HttpStatus.NOT_FOUND)
            }
            Object.assign(newAddress, dto);
            return await newAddress.save()
        } catch (error) {
            throw new HttpException('Ошибка при редактировании записи', HttpStatus.BAD_GATEWAY);
        }
    }


    async archiveAddress(id: string) {
        try {
            const address = await this.AddressRepository.findOne({ where: { id } });
            if (!address) {
                throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND);
            }
            address.archiving_an_address = true; // Изменяем статус на архивированный
            return await address.save(); // Сохраняем изменения в базе
        } catch (error) {
            throw new HttpException('Ошибка при архивировании записи', HttpStatus.BAD_REQUEST);
        }
    }
}


