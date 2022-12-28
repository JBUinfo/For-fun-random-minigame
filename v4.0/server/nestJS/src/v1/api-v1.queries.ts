import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';

@Injectable()
export class BootstrapQueries {
  constructor(
    @InjectRepository(PokemonsIDAndName)
    private readonly pokemonsIDAndNameRepository: Repository<PokemonsIDAndName>,
  ) {}

  async createNewPokemon({ id, name }): Promise<void> {
    await this.pokemonsIDAndNameRepository
      .createQueryBuilder()
      .insert()
      .into(PokemonsIDAndName)
      .values({ id, name })
      .orIgnore()
      .execute();
  }
}
