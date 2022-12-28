import { Injectable } from '@nestjs/common';
import { BootstrapQueries } from './api-v1.queries';
import { PokemonClient } from 'pokenode-ts';

@Injectable()
export class ApiV1Service {
  constructor(private readonly bootstrapQueries: BootstrapQueries) {}

  async createPokemons(): Promise<void> {
    const Pokedex_ = new PokemonClient();
    let pokemon = null;
    let id = null;
    let name = null;
    for (let i = 1; i < 906; i++) {
      pokemon = await Pokedex_.getPokemonById(i);
      id = pokemon.id;
      name = pokemon.species.name;
      await this.bootstrapQueries.createNewPokemon({ id, name });
    }
  }
}
