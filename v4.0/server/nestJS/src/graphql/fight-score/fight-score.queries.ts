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

@Injectable()
export class FightScoreQueries {
  constructor(
    @InjectRepository(Pokemons)
    private readonly pokemonRepository: Repository<Pokemons>,
  ) {}

  async updateUserScore(user_id: number): Promise<number> {
    //updatear plays user
    //subir niveles pokemon
    //evolucionar
    //comprobar evolcion de pokemons
    //comprobar numero de jugadas y añadir nuevo pokemon al inventario

    // 0 - no changes
    // 1 - new pokemon
    // 2 - new evolution
    // 3 - new evolution and new pokemon
    let state = 0;
    await this.pokemonRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const q = await transactionalEntityManager.findOneBy(Users, {
          id: user_id,
        });
        if (q) {
          await transactionalEntityManager.increment(
            Users,
            { id: user_id },
            'plays',
            1,
          );

          if (q.plays % 20 == 0) {
            state = 1;
            const newPokemon = generateRandomValues(user_id);
            newPokemon.selected = 0;
            await transactionalEntityManager.insert(Pokemons, newPokemon);
          }

          await transactionalEntityManager.increment(
            Pokemons,
            { user_id, selected: 1 },
            'level',
            1,
          );

          const b = await transactionalEntityManager.findBy(Pokemons, {
            level: Raw('evolution_level'),
          });
          await b.map(async (pok) => {
            await transactionalEntityManager.update(
              Pokemons,
              { id: pok.id },
              {
                pokemon_id: calcRandomNumber(1, 905),
                hp: pok.hp + calcRandomNumber(10, 50),
                speed: pok.speed + calcRandomNumber(1, 10),
                power: pok.power + calcRandomNumber(20, 40),
                evolution_level: pok.evolution_level + calcRandomNumber(15, 45),
              },
            );
          });
          if (b.length) state = state ? 3 : 2;
        }
      },
    );

    return state;
  }
}
