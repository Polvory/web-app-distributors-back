import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { DbModule } from './DataBase/database.module'



@Module({
  imports: [AddressModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
