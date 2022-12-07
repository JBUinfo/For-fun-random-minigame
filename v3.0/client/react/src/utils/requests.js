const envURL = "http://localhost:8080";

const getRequest = async (url) => {
  return await fetch(`${envURL}${url}`, {
    method: "GET",
  });
};

const postRequest = async (url, body) => {
  return await fetch(`${envURL}${url}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body,
  });
};

export const getPokemonsEnemies = async () => {
  const res = await getRequest("/getRandomEnemies");
  return await res.json();
};

export const requestLogin = async ({ nick, pass }) => {
  const res = await postRequest("/login", JSON.stringify({ nick, pass }));
  return await res.json();
};

export const requestRegister = async ({ nick, pass }) => {
  const res = await postRequest("/register", JSON.stringify({ nick, pass }));
  return await res.json();
};

export const getPokemonsBattle = async (userID) => {
  const res = await postRequest(
    "/getPokemonsBattle",
    JSON.stringify({ user_id: userID })
  );
  return await res.json();
};

export const getPokemonsInventory = async (userID) => {
  const res = await postRequest(
    "/getPokemonsInventory",
    JSON.stringify({ user_id: userID })
  );
  return await res.json();
};

export const updateLevelsAndPlays = async (userID) => {
  const res = await postRequest(
    "/updateLevelsAndPlays",
    JSON.stringify({ user_id: userID })
  );
  return await res.json();
};

export const requestSwapPokemon = async ({ inventory, battle, userID }) => {
  const res = await postRequest(
    "/swapPokemons",
    JSON.stringify({
      user_id: userID,
      inventory,
      battle,
    })
  );
  return await res.json();
};
