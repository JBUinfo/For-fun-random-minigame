import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemons } from 'src/entity/Pokemon.entity';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';

@Injectable()
export class UserTeamQueries {
  constructor(
    @InjectRepository(Pokemons)
    private readonly pokemonRepository: Repository<Pokemons>,
  ) {}

  async getTeam(user_id: number): Promise<Pokemons[]> {
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
        selected: 1,
      })
      .getMany();

    return result;
  }
}
