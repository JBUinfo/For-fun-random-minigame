import { Module } from '@nestjs/common';
import { ApiV1Controller } from './api-v1.controller';
import { ApiV1Service } from './api-v1.service';
import { LoginModule } from './user/login/login.module';
import { RegisterModule } from './user/register/register.module';
import { BootstrapQueries } from './api-v1.queries';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagePokemonModule } from './pokemon/pokemon-images/images.module';

@Module({
  imports: [
    LoginModule,
    RegisterModule,
    ImagePokemonModule,
    TypeOrmModule.forFeature([PokemonsIDAndName]),
  ],
  controllers: [ApiV1Controller],
  providers: [ApiV1Service, BootstrapQueries],
})
export class ApiV1Module {}
