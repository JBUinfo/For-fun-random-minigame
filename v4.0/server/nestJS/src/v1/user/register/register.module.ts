import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/User.entity';
import { RegisterQueries } from './register.queries';
import { CommonUserQueries } from '../common-queries/common.queries';
import { Pokemons } from 'src/entity/Pokemon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Pokemons]),
  ],
  controllers: [RegisterController],
  providers: [RegisterService, RegisterQueries, CommonUserQueries],
})
export class RegisterModule {}
