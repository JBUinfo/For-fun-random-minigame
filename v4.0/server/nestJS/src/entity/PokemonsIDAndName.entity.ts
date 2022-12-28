import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Pokemons } from './Pokemon.entity';

@Entity()
export class PokemonsIDAndName {
  @PrimaryGeneratedColumn()
  @OneToMany((type) => Pokemons, (p) => p.pokemon_id)
  @JoinColumn({ referencedColumnName: 'pokemon_id' })
  id: number;

  @Column('text')
  name: string;
}
