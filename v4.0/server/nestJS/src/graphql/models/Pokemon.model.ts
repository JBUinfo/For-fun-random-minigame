import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PokemonsIDAndName } from 'src/entity/PokemonsIDAndName.entity';

@ObjectType()
export class PokemonData {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  pokemon_id: number;

  @Field((type) => Int)
  user_id: number;

  @Field((type) => Int)
  selected: number;

  @Field((type) => Int)
  hp: number;

  @Field((type) => Int)
  actual_hp: number;

  @Field((type) => Int)
  level: number;

  @Field((type) => Int)
  speed: number;

  @Field((type) => Int)
  power: number;

  @Field((type) => Int)
  evolution_level: number;
}
