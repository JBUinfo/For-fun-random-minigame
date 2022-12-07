import { querys } from "../sqlite/querys.js";

const calcRandomNumber = (_min, _max) => {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min);
};

const generateRandomValues = () => {
  const pokemon = {};
  pokemon.pokemon_id = calcRandomNumber(1, 905);
  pokemon.hp = calcRandomNumber(1, 1000);
  pokemon.actualHP = pokemon.hp;
  pokemon.level = calcRandomNumber(1, 100);
  pokemon.velocity = calcRandomNumber(1, 10);
  pokemon.power = calcRandomNumber(125, 200);
  pokemon.evolution_level = calcRandomNumber(
    pokemon.level + 15,
    pokemon.level + 45
  );
  pokemon.id_next_evolution = calcRandomNumber(1, 905);
  return pokemon;
};

const generateRandomValuesUpdating = () => {
  const pokemon = {};
  pokemon.hp = calcRandomNumber(10, 50);
  pokemon.velocity = calcRandomNumber(1, 10);
  pokemon.power = calcRandomNumber(20, 40);
  pokemon.evolution_level = calcRandomNumber(15, 45);
  pokemon.id_next_evolution = calcRandomNumber(1, 905);
  return pokemon;
};

export const getResolvers = (database) => {
  const evolution = async (user_id) => {
    return await new Promise((resolve) => {
      const p = generateRandomValuesUpdating();
      database.run(
        querys.evolution,
        [
          p.hp,
          p.hp,
          p.velocity,
          p.power,
          p.evolution_level,
          p.id_next_evolution,
          user_id,
        ],
        (err) => {
          resolve(err);
        }
      );
    });
  };

  const insertPokemonToNewUser = async (user_id) => {
    const pokemon = await new Promise((resolve) => {
      const random = generateRandomValues();
      //generate response because the querys doesnt return the row
      const response = {
        pokemon_id: random.pokemon_id,
        user_id: user_id,
        selected: true,
        hp: random.hp,
        level: random.level,
        velocity: random.velocity,
        power: random.power,
        evolution_level: random.evolution_level,
        id_next_evolution: random.id_next_evolution,
      };
      database.run(
        querys.insertToInventory,
        [
          random.pokemon_id,
          user_id,
          true,
          random.hp,
          random.actualHP,
          random.level,
          random.velocity,
          random.power,
          random.evolution_level,
          random.id_next_evolution,
        ],
        (err) => {
          if (err) resolve({ data: null, error: 1 });
          resolve({ data: response, error: err });
        }
      );
    });
    return pokemon;
  };

  const resolvers = {
    Hello: () => "Hola mundo",
    insertUser: async ({ params }) => {
      let user = await new Promise((resolve) => {
        database.run(querys.insertUser, [params.nick, params.pass], (err) => {
          if (err) resolve({ data: null, error: 1 });
          resolve({ data: null, error: err });
        });
      });
      if (user.error != 1) {
        user = await new Promise((resolve) => {
          database.get(
            querys.selectUser,
            [params.nick, params.pass],
            (err, data) => {
              if (err) resolve({ data: null, error: 1 });
              insertPokemonToNewUser(data.user_id);
              insertPokemonToNewUser(data.user_id);
              insertPokemonToNewUser(data.user_id);
              resolve({ data: true, error: err });
            }
          );
        });
        if (user.data) {
          user = await resolvers.login({ params });
        }
      }
      return user;
    },
    login: async ({ params }) => {
      const user = await new Promise((resolve) => {
        database.get(
          querys.selectUser,
          [params.nick, params.pass],
          (err, data) => {
            if (data) resolve({ data: data.user_id, error: err });
            resolve({ data: null, error: 1 });
          }
        );
      });
      return user;
    },
    getPokemonById: async ({ id }) => {
      const pokemon = await new Promise((resolve) => {
        database.get(querys.selectPokemon, [id], (err, data) => {
          if (err) resolve({ data: null, error: 1 });
          resolve({ data: data, error: err });
        });
      });
      return pokemon;
    },
    getAllPokemons: async () => {
      const pokemons = await new Promise((resolve) => {
        database.all(querys.selectAllPokemon, [], (err, data) => {
          resolve({ data: data, error: err });
        });
      });
      return pokemons;
    },
    insertPokemonToUser: async ({ user_id }) => {
      const pokemon = await new Promise((resolve) => {
        const random = generateRandomValues();
        //generate response because the querys doesnt return the row
        const response = {
          pokemon_id: random.pokemon_id,
          user_id: user_id,
          selected: false,
          hp: random.hp,
          actualHP: random.actualHP,
          level: random.level,
          velocity: random.velocity,
          power: random.power,
          evolution_level: random.evolution_level,
          id_next_evolution: random.id_next_evolution,
        };
        database.run(
          querys.insertToInventory,
          [
            random.pokemon_id,
            user_id,
            false,
            random.hp,
            random.hp,
            random.level,
            random.velocity,
            random.power,
            random.evolution_level,
            random.id_next_evolution,
          ],
          (err) => {
            if (err) resolve({ data: null, error: 1 });
            resolve({ data: response, error: err });
          }
        );
      });
      return pokemon;
    },
    getAllPokemonsFromInventory: async ({ user_id }) => {
      const pokemons = await new Promise((resolve) => {
        database.all(
          querys.selectPokemonsFromUserInventory,
          [user_id],
          (err, data) => {
            if (err) resolve({ data: null, error: 1 });
            resolve({ data: data, error: err });
          }
        );
      });
      return pokemons;
    },
    getPokemonsFromUserBattle: async ({ user_id }) => {
      const pokemons = await new Promise((resolve) => {
        database.all(
          querys.selectPokemonsFromUserBattle,
          [user_id],
          (err, data) => {
            if (err) resolve({ data: null, error: 1 });
            resolve({ data: data, error: err });
          }
        );
      });
      return pokemons;
    },
    getRandomEnemies: async () => {
      const randoms = [
        generateRandomValues(),
        generateRandomValues(),
        generateRandomValues(),
      ].sort((a, b) => a.pokemon_id - b.pokemon_id);
      const pokemons = await new Promise((resolve) => {
        database.all(
          querys.selectEnemiesPokemons,
          [randoms[0].pokemon_id, randoms[1].pokemon_id, randoms[2].pokemon_id],
          (err, data) => {
            if (err) resolve({ data: null, error: 1 });
            randoms[0] = { ...randoms[0], ...data[0] };
            randoms[1] = { ...randoms[1], ...data[1] };
            randoms[2] = { ...randoms[2], ...data[2] };
            resolve({ data: randoms, error: err });
          }
        );
      });
      return pokemons;
    },
    updatePlays: async ({ params }) => {
      const pokemonsLevelUp = await new Promise((resolve) => {
        database.run(querys.updateLevel, [params.user_id], (err, data) => {
          if (err) resolve({ data: null, error: 1 });
          resolve({ data: data, error: err });
        });
      });
      if (pokemonsLevelUp.err == null) {
        const evolutions = await new Promise((resolve) => {
          let thereAreEvolutions = false;
          database.all(
            querys.selectPokemonsFromUserBattle,
            [params.user_id],
            (err, data) => {
              if (err) resolve({ data: null, error: 1 });
              data.forEach(async (p) => {
                if (p.level >= p.evolution_level) {
                  thereAreEvolutions = true;
                  const ev = await evolution(params.user_id);
                  if (ev != null) {
                    resolve({ data: { evolutions: false }, error: 1 });
                  }
                }
              });
              resolve({ data: thereAreEvolutions, error: null });
            }
          );
        });
        if (evolutions.error == null) {
          const updatePlays = await new Promise((resolve) => {
            database.run(querys.updatePlays, [params.user_id], async (err) => {
              if (err) resolve({ data: null, error: 1 });
              database.get(
                querys.selectUserFromID,
                [params.user_id],
                async (err, data) => {
                  if (err) resolve({ data: null, error: 1 });
                  if (data.plays % 10 == 0) {
                    await resolvers.insertPokemonToUser(params);
                    resolve({ data: true, error: null });
                  }
                  resolve({ data: false, error: null });
                }
              );
            });
          });
          if (updatePlays.error == null) {
            let reponse = "";
            if (evolutions.data) {
              reponse = "ONE OR MORE POKEMONS HAVE EVOLVED";
            }
            if (updatePlays.data) {
              reponse = reponse
                ? reponse + " AND YOU HAVE RECEIVED A NEW POKEMON"
                : "YOU HAVE RECEIVED A NEW POKEMON";

              reponse += "";
            }
            reponse = reponse ? reponse + "." : "";
            return { data: reponse, error: null };
          }
        }
      }
      return { data: null, error: 1 };
    },
    swapPokemons: async ({ params }) => {
      const inventoryToBattle = await new Promise((resolve) => {
        database.run(
          querys.swapInventoryToBattle,
          [params.user_id, params.inventory],
          (err) => {
            if (err) resolve({ data: null, error: 1 });
            resolve({ data: true, error: null });
          }
        );
      });
      if (inventoryToBattle.data) {
        const battleToInventory = await new Promise((resolve) => {
          database.run(
            querys.swapBattleToInventory,
            [params.user_id, params.battle],
            (err) => {
              if (err) resolve({ data: null, error: 1 });
              resolve({ data: true, error: null });
            }
          );
        });
        if (battleToInventory.data) return { data: true, error: null };
      } else {
        return { data: null, error: 1 };
      }
    },
  };

  return resolvers;
};
