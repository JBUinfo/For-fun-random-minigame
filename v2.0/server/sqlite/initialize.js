import { querys } from "./querys.js";

const createTables = (database) => {
  database.run(querys.createTableUsers);
  database.run(querys.createTablePokemons);
  database.run(querys.createTableUserInventory);
};

const insertPokemons = async (database, P) => {
  let pokemon = null;
  let id = null;
  let name = null;
  for (let i = 1; i < 906; i++) {
    pokemon = await P.getPokemonByName(i);
    id = pokemon.id;
    name = pokemon.species.name;
    database.run(querys.insertPokemon, [id, name]);
  }
};

export const initializeDB = (database, P) => {
  createTables(database);
  insertPokemons(database, P);
};
