import { Pokemons } from 'src/entity/Pokemon.entity';

const calcRandomNumber = (_min, _max): number => {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min);
};

const generateRandomValues = (user_id): Pokemons => {
  const pokemon: Pokemons = new Pokemons();
  pokemon.pokemon_id = calcRandomNumber(1, 905);
  pokemon.user_id = user_id;
  pokemon.hp = calcRandomNumber(1, 1000);
  pokemon.actual_hp = pokemon.hp;
  pokemon.level = calcRandomNumber(1, 100);
  pokemon.speed = calcRandomNumber(1, 10);
  pokemon.power = calcRandomNumber(125, 200);
  pokemon.evolution_level = calcRandomNumber(
    pokemon.level + 15,
    pokemon.level + 45,
  );
  pokemon.id_next_evolution = calcRandomNumber(1, 905);
  //after, add selected
  return pokemon;
};

const generateRandomValuesUpdating = () => null;

export { generateRandomValues, calcRandomNumber, generateRandomValuesUpdating };
