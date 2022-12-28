import { gql } from "@apollo/client";
const ENV_URL = import.meta.env.VITE_URL;

export interface IPokemonStats {
  hp: number;
  id: number;
  name: string;
  level: number;
  power: number;
  actualHP: number;
  speed: number;
  pokemon_id: number;
  evolution_level: number;
}

export interface ISwapRequest {
  battle: number;
  UserID: number;
  inventory: number;
}

export interface IUserPass {
  nick: string;
  pass: string;
}

export interface IResponse {
  data: any | null;
  error: any | null;
}

const getRequest = async (url: string): Promise<IResponse> => {
  return await fetch(`${ENV_URL}${url}`, {
    method: "GET",
  })
    .then(async (e) => await e.json())
    .catch(() => ({ data: null, error: "Error in request" }));
};

const postRequest = async (url: string, body: string): Promise<IResponse> => {
  return await fetch(`${ENV_URL}${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  })
    .then(async (e) => await e.json())
    .catch(() => ({ data: null, error: "Error in request" }));
};

export const getPokemonsEnemies = async (): Promise<IResponse> => {
  const res: IResponse = await getRequest("/getRandomEnemies");
  return res;
};

export const requestLogin = async ({
  nick,
  pass,
}: IUserPass): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/v1/login",
    JSON.stringify({ nick, pass })
  );
  return res.error
    ? { data: null, error: "Error in login" }
    : { data: res, error: null };
};

export const requestRegister = async ({
  nick,
  pass,
}: IUserPass): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/v1/register",
    JSON.stringify({ nick, pass })
  );
  return res.error
    ? { data: null, error: "Error in register" }
    : { data: res, error: null };
};

export const GET_POKEMONS_NAME = async (client: any, pokemons_id: number[]) =>
  await client.mutate({
    mutation: gql`
      query getTeamFromUserID($pokemons_id: [Int!]) {
        getPokemonsName(pokemons_id: $pokemons_id) {
          id
          name
        }
      }
    `,
    variables: { pokemons_id },
  });

export const GET_POKEMONS_TEAM = gql`
  query getTeamFromUserID($user_id: Int!) {
    getTeamFromUserID(user_id: $user_id) {
      id
      pokemon_id {
        name
        id
      }
      hp
      actual_hp
      level
      speed
      power
      evolution_level
    }
  }
`;

export const GET_POKEMONS_INVENTORY = gql`
  query getInventoryFromUserID($user_id: Int!) {
    getInventoryFromUserID(user_id: $user_id) {
      id
      pokemon_id {
        name
        id
      }
      hp
      actual_hp
      level
      speed
      power
      evolution_level
    }
  }
`;

export const UPDATE_FIGHTS_AND_SCORES = async (client: any, user_id: number) =>
  await client.mutate({
    mutation: gql`
      mutation updateUser($user_id: Int!) {
        updateUser(user_id: $user_id)
      }
    `,
    variables: { user_id },
  });

export const SWAP_POKEMONS = async (
  client: any,
  pokemon_inventory: number,
  pokemon_team: number
) =>
  await client.mutate({
    mutation: gql`
      mutation swapInventoryTeam(
        $pokemon_inventory: Int!
        $pokemon_team: Int!
      ) {
        swapInventoryTeam(
          pokemon_inventory: $pokemon_inventory
          pokemon_team: $pokemon_team
        ) {
          id
          pokemon_id {
            name
            id
          }
          hp
          actual_hp
          level
          speed
          power
          evolution_level
        }
      }
    `,
    variables: { pokemon_inventory, pokemon_team },
  });
