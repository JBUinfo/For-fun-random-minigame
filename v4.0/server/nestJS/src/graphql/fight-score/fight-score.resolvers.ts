import { FightScoreQueries } from './fight-score.queries';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class FightScoreResolver {
  constructor(private readonly fightScoreQueries: FightScoreQueries) {}

  @Mutation()
  //TODO AUTHENTICATION
  async updateUser(@Args('user_id') user_id: number) {
    const pokemonsInventory = await this.fightScoreQueries.updateUserScore(
      user_id,
    );
    return pokemonsInventory;
  }
}
