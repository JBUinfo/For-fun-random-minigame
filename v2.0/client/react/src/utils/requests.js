const envURL = "http://localhost:8080";

export const requestLogin = async ({ nick, pass }) => {
  const res = await fetch(`${envURL}/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nick, pass }),
  });
  return await res.json();
};

export const requestRegister = async ({ nick, pass }) => {
  const res = await fetch(`${envURL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nick, pass }),
  });
  return await res.json();
};

export const getPokemons = async (userID) => {
  const res = await fetch(`${envURL}/getPokemons`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userID }),
  });
  return await res.json();
};

export const getPokemonsEnemies = async () => {
  const res = await fetch(`${envURL}/getRandomEnemies`, {
    method: "GET",
  });
  return await res.json();
};

export const updateLevelsAndPlays = async (userID) => {
  const res = await fetch(`${envURL}/updateLevelsAndPlays`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userID }),
  });
  //update in db selecteds
  return await res.json();
};

export const requestSwapPokemon = async ({ inventory, battle, userID }) => {
  const res = await fetch(`${envURL}/swapPokemons`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userID,
      inventory,
      battle,
    }),
  });
  //update in db selecteds
  return await res.json();
};
