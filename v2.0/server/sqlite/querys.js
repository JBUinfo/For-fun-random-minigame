import sql from 'sqlite3';
const sqlite3 = sql.verbose()
export const database = new sqlite3.Database("./sqlite/pokemon2.db");
const createTableUsers = `
    CREATE TABLE IF NOT EXISTS Users (
    user_id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    nick text NOT NULL UNIQUE,
    pass text NOT NULL ,
    plays integer NOT NULL 
)`

const insertUser = `INSERT INTO Users (nick,pass,plays) VALUES ((?),(?), 0)`
const selectUser = `SELECT user_id, nick, plays FROM Users WHERE nick=(?) and pass=(?)`
const selectUserFromID = `SELECT plays FROM Users WHERE user_id=(?)`

const createTablePokemons = `
    CREATE TABLE IF NOT EXISTS Pokemons (
    pokemon_id integer PRIMARY KEY,
    name text
)`
const insertPokemon = `INSERT OR IGNORE INTO Pokemons (
  pokemon_id,
  name
) VALUES ( (?), (?) )`
const selectPokemon = `SELECT * FROM Pokemons WHERE pokemon_id=(?)`
const selectAllPokemon = `SELECT * FROM Pokemons`

const createTableUserInventory = `
    CREATE TABLE IF NOT EXISTS UserInventory (
    id integer PRIMARY KEY AUTOINCREMENT,
    pokemon_id integer,
    user_id integer,
    selected integer,
    hp integer,
    level integer,
    velocity integer,
    power real,
    evolution_level integer,
    id_next_evolution integer,
    FOREIGN KEY (pokemon_id) REFERENCES Pokemons (pokemon_id),
    FOREIGN KEY (user_id) REFERENCES Users (user_id)
)`
const insertToInventory = `INSERT INTO UserInventory (
  pokemon_id,
  user_id,
  selected,
  hp,
  level,
  velocity,
  power,
  evolution_level,
  id_next_evolution
) VALUES ( (?), (?), (?), (?), (?), (?), (?), (?), (?) )`
const selectPokemonsFromUser = `
SELECT * FROM UserInventory
INNER JOIN Pokemons ON UserInventory.pokemon_id = Pokemons.pokemon_id
WHERE user_id=(?)`
const selectSelectedPokemonsFromUser = `
SELECT * FROM UserInventory
INNER JOIN Pokemons ON UserInventory.pokemon_id = Pokemons.pokemon_id
WHERE user_id=(?) AND selected=1`
const selectEnemiesPokemons = `
SELECT * FROM Pokemons WHERE 
pokemon_id=(?) OR
pokemon_id=(?) OR
pokemon_id=(?)
`
const updateLevel = `
UPDATE UserInventory
SET
level = level + 1
WHERE
user_id=(?) AND
selected=1
`
const evolution = `
UPDATE UserInventory
SET
pokemon_id = id_next_evolution,
hp = hp + (?),
velocity = velocity + (?),
power = power + (?),
evolution_level = evolution_level + (?),
id_next_evolution = (?)
WHERE 
id = (
  SELECT id
  FROM UserInventory
  WHERE
  evolution_level <= level AND
  user_id = (?) AND
  selected = 1
  ORDER BY id
  LIMIT 1) 
`

const updatePlays = `
UPDATE Users
SET
plays = plays + 1
WHERE
user_id = (?)
`

const swapInventoryToBattle = `
UPDATE UserInventory
SET
selected = 1
WHERE
user_id = (?) AND
id = (?)
`

const swapBattleToInventory = `
UPDATE UserInventory
SET
selected = 0
WHERE
user_id = (?) AND
id = (?)
`

export const querys = {
  createTableUsers,
  selectUserFromID,
  insertUser,
  selectUser,
  createTablePokemons,
  insertPokemon,
  selectPokemon,
  selectAllPokemon,
  createTableUserInventory,
  insertToInventory,
  selectPokemonsFromUser,
  selectSelectedPokemonsFromUser,
  selectEnemiesPokemons,
  updateLevel,
  updatePlays,
  evolution,
  swapBattleToInventory,
  swapInventoryToBattle
}
