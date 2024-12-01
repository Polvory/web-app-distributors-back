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
        this.logger.log(`Запрос на создание нового адреса:${JSON.stringify(dto, null, 2)}`)
        try {
            const new_address = await this.AddressRepository.create(dto);
            this.logger.log(`Адрес успешно создан:${JSON.stringify(new_address, null, 2)}`)
            return new_address;
        } catch (error) {
            this.logger.error(`Ошибка создания нового адреса:${JSON.stringify(dto, null, 2)}`)
            throw new HttpException('Ошибка создания записи', HttpStatus.BAD_REQUEST);
        }
    }

    async get(archive: boolean, street: string, house_number: number) {
        this.logger.log(`Поиск по улице: ${street}, архив: ${archive}, номер дома: ${house_number}`);
        try {
            const result = await this.AddressRepository.findAll({
                where: {
                    archiving_an_address: archive,
                    street: { [Op.iLike]: `%${street}%` }
                },
            });
            this.logger.log(`Найдено адресов ${result.length} по улице: ${street}, номеру дома: ${house_number}`);

            return result;

        } catch (error) {
            this.logger.error(`Ошибка получения адресов по запросу: ${street}, номеру дома: ${house_number}`, error.stack);

            throw new HttpException('Ошибка при получении записей', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async editAddress(id: string, dto: any) {
        try {
            this.logger.log(`Редактируем адрес с ID: ${id}`)

            const newAddress = await this.AddressRepository.findOne({ where: { id } })

            this.logger.log(`Найденный адрес: ${JSON.stringify(newAddress)}`);

            if (!newAddress) {
                this.logger.warn(`Адрес с ID:${id} не найдена`);

                throw new HttpException('запись не найдена', HttpStatus.NOT_FOUND)
            }
            Object.assign(newAddress, dto);
            const updatedAddress = await newAddress.save();

            this.logger.log(`Адрес с ID: ${id} успешно обновлён`);

            return updatedAddress

        } catch (error) {
            this.logger.error(`Ошибка при редактировании адреса c ID: ${id}`, error.stack);

            throw new HttpException('Ошибка при редактировании записи', HttpStatus.BAD_GATEWAY);
        }
    }


    async archiveAddress(id: string, archive: boolean) {
        try {

            this.logger.log(`Попытка архивировать адрес с ID: ${id}, archive:${archive}`);

            const address = await this.AddressRepository.findOne({ where: { id } });
            if (!address) {
                this.logger.warn(`Адрес с ID: ${id} не найден`)
                throw new HttpException('Запись не найдена', HttpStatus.NOT_FOUND);
            }
            this.logger.log(`Адрес с ID: ${id} найден, меняем статус архивации на ${archive}`);

            address.archiving_an_address = archive;

            const updatedAddress = await address.save();
            this.logger.log(`Адрес с ID: ${id} успешно архивирован/разархивирован. Новый статус: ${updatedAddress.archiving_an_address}`);

            return await address.save(); // Сохраняем изменения в базе

        } catch (error) {
            this.logger.error(`Ошибка при архивации адреса c ID: ${id}`, error.stack);

            throw new HttpException('Ошибка при архивировании записи', HttpStatus.BAD_REQUEST);
        }
    }
}

//*В запросе передаём id и значение boolean в функции добавления записи в архив
//!Загрузить в файловую систему папку ExcelData. В эту папку загрузить файл Excel, отдельная папка под Excel с контроллером, сервисом и модулем
//*сделать всем задачам и ошибкам логгеры


