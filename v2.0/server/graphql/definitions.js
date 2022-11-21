export const typeDefs = `
  input UserInput {
    nick: String!
    pass: String!
  }

  input SwapInput {
    user_id: Int!
    inventory: Int!
    battle: Int!
  }

  type Pokemon {
    pokemon_id:Int!
    name:String!
  }

  type PokemonInInventory {
    id:Int!
    name:String!
    pokemon_id:Int!
    user_id:Int!
    selected:Int!
    hp:Int!
    level:Int!
    velocity:Int!
    power:Float!
    evolution_level:Int!
    id_next_evolution:Int!
  }

  type PokemonEnemy {
    name:String!
    pokemon_id:Int!
    image:String!
    selected:Int!
    hp:Int!
    level:Int!
    velocity:Int!
    power:Float!
    evolution_level:Int!
    id_next_evolution:Int!
  }

  type ResponseBoolean {
    data: Boolean
    error: Int 
  }

  type ResponseInt {
    data: Int
    error: Int 
  }

  type ResponsePokemon {
    data: Pokemon
    error: Int 
  }

  type ResponseArrayPokemon {
    data: [Pokemon]
    error: Int 
  }

  type ResponsePokemonInventory {
    data: PokemonInInventory
    error: Int 
  }

  type ResponseArrayPokemonInventory {
    data: [PokemonInInventory]
    error: Int 
  }

  type ResponseArrayPokemonEnemy {
    data: [PokemonEnemy]
    error: Int 
  }

  type ResponseUpdatePlays {
    data: String
    error: Int
  }

  type Query {
    Hello:String!
    login(params: UserInput!):ResponseInt!
    getPokemonById(id:Int!): ResponsePokemon
    getAllPokemons: ResponseArrayPokemon!
    getAllPokemonsFromInventory(user_id: Int!):ResponseArrayPokemonInventory!
    getRandomEnemies:ResponseArrayPokemonEnemy!
  }

  type Mutation {
    insertUser(params: UserInput):ResponseBoolean!
    insertPokemonToUser(user_id: Int!):ResponsePokemonInventory!
    updatePlays(user_id: Int!):ResponseUpdatePlays!
    swapPokemons(params: SwapInput): ResponseBoolean!
  }
`;
