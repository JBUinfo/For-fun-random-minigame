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

const getRequest = async (url: string): Promise<Response> => {
  return await fetch(`${ENV_URL}${url}`, {
    method: "GET",
  });
};

const postRequest = async (url: string, body: string): Promise<Response> => {
  return await fetch(`${ENV_URL}${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
};

export const getPokemonsEnemies = async (): Promise<IResponse> => {
  const res: Response = await getRequest("/getRandomEnemies");
  return await res.json();
};

export const requestLogin = async ({
  nick,
  pass,
}: IUserPass): Promise<IResponse> => {
  const res: Response = await postRequest(
    "/login",
    JSON.stringify({ nick, pass })
  );
  return await res.json();
};

export const requestRegister = async ({
  nick,
  pass,
}: IUserPass): Promise<IResponse> => {
  const res: Response = await postRequest(
    "/register",
    JSON.stringify({ nick, pass })
  );
  return await res.json();
};

export const getPokemonsBattle = async (UserID: number): Promise<IResponse> => {
  const res: Response = await postRequest(
    "/getPokemonsBattle",
    JSON.stringify({ user_id: UserID })
  );
  return await res.json();
};

export const getPokemonsInventory = async (
  UserID: number
): Promise<IResponse> => {
  const res: Response = await postRequest(
    "/getPokemonsInventory",
    JSON.stringify({ user_id: UserID })
  );
  return await res.json();
};

export const updateLevelsAndPlays = async (
  UserID: number
): Promise<IResponse> => {
  const res: Response = await postRequest(
    "/updateLevelsAndPlays",
    JSON.stringify({ user_id: UserID })
  );
  return await res.json();
};

export const requestSwapPokemon = async ({
  inventory,
  battle,
  UserID,
}: ISwapRequest): Promise<IResponse> => {
  const res: Response = await postRequest(
    "/swapPokemons",
    JSON.stringify({
      user_id: UserID,
      inventory,
      battle,
    })
  );
  return await res.json();
};
