import { PokemonNameQueries } from './pokemon-name.queries';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class PokemonNameResolver {
  constructor(private readonly pokemonNameQueries: PokemonNameQueries) {}

  @Query()
  //TODO AUTHENTICATION
  async getPokemonsName(@Args('pokemons_id') pokemons_id: number[]) {
    const pokemonsInventory = await this.pokemonNameQueries.getNames(
      pokemons_id,
    );
    return pokemonsInventory;
  }
}
