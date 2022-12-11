const ENV_URL = import.meta.env.VITE_URL;

export interface IPokemonStats {
  hp: number;
  id: number;
  name: string;
  level: number;
  power: number;
  actualHP: number;
  velocity: number;
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
    "/login",
    JSON.stringify({ nick, pass })
  );
  return res;
};

export const requestRegister = async ({
  nick,
  pass,
}: IUserPass): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/register",
    JSON.stringify({ nick, pass })
  );
  return res;
};

export const getPokemonsBattle = async (UserID: number): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/getPokemonsBattle",
    JSON.stringify({ user_id: UserID })
  );
  return res;
};

export const getPokemonsInventory = async (
  UserID: number
): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/getPokemonsInventory",
    JSON.stringify({ user_id: UserID })
  );
  return res;
};

export const updateLevelsAndPlays = async (
  UserID: number
): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/updateLevelsAndPlays",
    JSON.stringify({ user_id: UserID })
  );
  return res;
};

export const requestSwapPokemon = async ({
  inventory,
  battle,
  UserID,
}: ISwapRequest): Promise<IResponse> => {
  const res: IResponse = await postRequest(
    "/swapPokemons",
    JSON.stringify({
      user_id: UserID,
      inventory,
      battle,
    })
  );
  return res;
};
