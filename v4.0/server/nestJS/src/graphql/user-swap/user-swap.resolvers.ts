import { UserSwapQueries } from './user-swap.queries';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserSwapResolver {
  constructor(private readonly userSwapQueries: UserSwapQueries) {}

  @Mutation()
  //TODO AUTHENTICATION
  async swapInventoryTeam(
    @Args('pokemon_inventory') pokemon_inventory: number,
    @Args('pokemon_team') pokemon_team: number,
  ) {
    const pokemonsSwap = await this.userSwapQueries.swap(
      pokemon_inventory,
      pokemon_team,
    );
    return pokemonsSwap;
  }
}
