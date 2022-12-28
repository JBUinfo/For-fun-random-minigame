import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PokemonsIDAndName } from './PokemonsIDAndName.entity';

@Entity()
export class Pokemons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  @OneToOne((type) => PokemonsIDAndName, (p) => p.id)
  @JoinColumn({ referencedColumnName: 'id' })
  pokemon_id: number;

  @Column('integer')
  user_id: number;

  @Column('integer')
  selected: number;

  @Column('integer')
  hp: number;

  @Column('integer')
  actual_hp: number;

  @Column('integer')
  level: number;

  @Column('integer')
  speed: number;

  @Column('double')
  power: number;

  @Column('integer')
  evolution_level: number;

  @Column('integer')
  id_next_evolution: number;
}
