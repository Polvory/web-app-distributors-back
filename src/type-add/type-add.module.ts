import { Module } from '@nestjs/common';
import { TypeAddController } from './type-add.controller';
import { TypeAddService } from './type-add.service';
import { JwtAuthModule } from '../jwt-auth/jwt-auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { TypeAdd } from './type-add.model';

@Module({
  controllers: [TypeAddController],
  imports: [
    JwtAuthModule,
    SequelizeModule.forFeature([TypeAdd]),
  ],
  providers: [TypeAddService],
  exports: [TypeAddService]
})
export class TypeAddModule { }
