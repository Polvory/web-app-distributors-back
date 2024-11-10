import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Addresses } from './address.model';

@Module({
  controllers: [AddressController,],
  providers: [AddressService],
  imports:[SequelizeModule.forFeature([Addresses])]
})
export class AddressModule {}
