import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Addresses } from '../address/address.model';
import { Users } from '../users/users.model';
import { TypeAdd } from '../type-add/type-add.model';



@Module({

    imports: [
        SequelizeModule.forRootAsync({
            useFactory: () => ({
                dialect: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'postgres',
                password: '1994sergei1994',
                database: 'DestributorsBD',
                models: [
                    Addresses,
                    Users,
                    TypeAdd
                ],
                autoLoadModels: true
            })
        }),
    ]
})
export class DbModule { }
