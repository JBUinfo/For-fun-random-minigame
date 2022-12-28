import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemons } from 'src/entity/Pokemon.entity';
import { PokemonData } from '../models/Pokemon.model';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';

@Injectable()
export class UserInventoryQueries {
  constructor(
    @InjectRepository(Pokemons)
    private readonly pokemonRepository: Repository<Pokemons>,
  ) {}

  async getInventory(user_id: number): Promise<PokemonData[]> {
    const result = await this.pokemonRepository
      .createQueryBuilder('Pokemons')
      .innerJoinAndMapOne(
        'Pokemons.pokemon_id',
        PokemonsIDAndName,
        'pID',
        'pID.id = Pokemons.pokemon_id',
      )
      .where({
        user_id,
        selected: 0,
      })
      .getMany();

    return result;
  }
}
