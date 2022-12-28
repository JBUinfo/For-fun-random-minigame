import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ApiV1Module } from './v1/api-v1.module';
import { APP_ROUTES } from './app.routes';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserTeamResolver } from './graphql/user-team/user-team.resolvers';
import { UserTeamQueries } from './graphql/user-team/user-team.queries';
import { Pokemons } from './entity/Pokemon.entity';
import { UserSwapResolver } from './graphql/user-swap/user-swap.resolvers';
import { UserInventoryResolver } from './graphql/user-inventory/user-inventory.resolvers';
import { FightScoreResolver } from './graphql/fight-score/fight-score.resolvers';
import { UserSwapQueries } from './graphql/user-swap/user-swap.queries';
import { UserInventoryQueries } from './graphql/user-inventory/user-inventory.queries';
import { FightScoreQueries } from './graphql/fight-score/fight-score.queries';
import { Users } from './entity/User.entity';
import { PokemonsIDAndName } from './entity/PokemonsIDAndName.entity';
import { ApiV1Service } from './v1/api-v1.service';
import { BootstrapQueries } from './v1/api-v1.queries';
import { PokemonNameResolver } from './graphql/pokemon-name/pokemon-name.resolvers';
import { PokemonNameQueries } from './graphql/pokemon-name/pokemon-name.queries';

const resolvers = [
  UserTeamResolver,
  UserSwapResolver,
  UserInventoryResolver,
  FightScoreResolver,
  PokemonNameResolver,
];
const queries = [
  UserTeamQueries,
  UserSwapQueries,
  UserInventoryQueries,
  FightScoreQueries,
  BootstrapQueries,
  PokemonNameQueries,
];

@Module({
  imports: [
    ApiV1Module,
    RouterModule.register(APP_ROUTES),
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      debug: true,
      path: '/graphql',
      driver: ApolloDriver,
      typePaths: ['./src/graphql/schema.gql'],
      playground: true,
    }),
    TypeOrmModule.forFeature([Pokemons, PokemonsIDAndName]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      database: 'pokemon2.db',
      synchronize: true,
      logging: false,
    }),
  ],
  providers: [...resolvers, ...queries, ApiV1Service],
})
export class AppModule {
  constructor(private readonly apiV1Service: ApiV1Service) {
    this.apiV1Service.createPokemons();
  }
}
