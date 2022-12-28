import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Pokemons } from 'src/entity/Pokemon.entity';
import { Users } from 'src/entity/User.entity';
import {
  calcRandomNumber,
  generateRandomValues,
  generateRandomValuesUpdating,
} from 'src/utils/generate-random-pokemon.util';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';

@Injectable()
export class PokemonNameQueries {
  constructor(
    @InjectRepository(PokemonsIDAndName)
    private readonly pokemonRepository: Repository<PokemonsIDAndName>,
  ) {}

  async getNames(pokemons_id: number[]): Promise<PokemonsIDAndName[]> {
    const res = await Promise.all(
      pokemons_id.map(
        async (i) =>
          await this.pokemonRepository.findOneBy({
            id: i,
          }),
      ),
    );
    return res;
  }
}
