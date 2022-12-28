import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Users } from '../../../entity/User.entity';
import { generateRandomValues } from 'src/utils/generate-random-pokemon.util';
import { Pokemons } from 'src/entity/Pokemon.entity';

interface IUserPass {
  nick: string;
  pass: string;
}

@Injectable()
export class RegisterQueries {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Pokemons)
    private readonly pokemonsRepository: Repository<Pokemons>,
  ) {}

  async createNewUser({ nick, pass }: IUserPass): Promise<Users> {
    let newUser = {
      id: null,
      nick,
      pass,
      plays: 0,
    };
    await this.userRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const records = await transactionalEntityManager.insert(Users, {
          nick,
          pass,
        });
        const newPokemon1 = generateRandomValues(records.generatedMaps[0].id);
        const newPokemon2 = generateRandomValues(records.generatedMaps[0].id);
        const newPokemon3 = generateRandomValues(records.generatedMaps[0].id);
        newPokemon1.selected = 1;
        newPokemon2.selected = 1;
        newPokemon3.selected = 1;
        await transactionalEntityManager.insert(Pokemons, [
          newPokemon1,
          newPokemon2,
          newPokemon3,
        ]);
        newUser.id = records.generatedMaps[0].id;
      },
    );
    return newUser;
  }
}
