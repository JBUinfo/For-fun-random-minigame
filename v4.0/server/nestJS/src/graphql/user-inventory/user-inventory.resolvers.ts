import { UserInventoryQueries } from './user-inventory.queries';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UserInventoryResolver {
  constructor(private readonly userInventoryQueries: UserInventoryQueries) {}

  @Query()
  //TODO AUTHENTICATION
  async getInventoryFromUserID(@Args('user_id') user_id: number) {
    const pokemonsInventory = await this.userInventoryQueries.getInventory(
      user_id,
    );
    return pokemonsInventory;
  }
}
