import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemons } from 'src/entity/Pokemon.entity';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';

@Injectable()
export class UserSwapQueries {
  constructor(
    @InjectRepository(Pokemons)
    private readonly pokemonRepository: Repository<Pokemons>,
  ) {}

  async swap(
    pokemon_inventory: number,
    pokemon_team: number,
  ): Promise<Pokemons[]> {
    await this.pokemonRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          Pokemons,
          { id: pokemon_inventory },
          { selected: 1 },
        );
        await transactionalEntityManager.update(
          Pokemons,
          { id: pokemon_team },
          { selected: 0 },
        );
      },
    );

    const pokemonsUser = await this.pokemonRepository
      .createQueryBuilder('Pokemons')
      .innerJoinAndMapOne(
        'Pokemons.pokemon_id',
        PokemonsIDAndName,
        'pID',
        'pID.id = Pokemons.pokemon_id',
      )
      .where([{ id: pokemon_inventory }, { id: pokemon_team }])
      .getMany();
    return pokemonsUser;
  }
}
