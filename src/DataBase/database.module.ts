import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Addresses } from 'src/address/address.model';



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
                    Addresses
                ],
                autoLoadModels: true
            })
        }),
    ]
})
export class DbModule { }
