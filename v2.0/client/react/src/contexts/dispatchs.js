export const dispatch_types = {
  SET_USER_ID: "SET_USER_ID",
  SET_STATS_MENU: "SET_STATS_MENU",
  SET_DATA_MODAL: "SET_DATA_MODAL",
  CLOSE_MODAL: "CLOSE_MODAL",
  RESET_SWAP: "RESET_SWAP",
  SET_SWAP_POKEMON_INVENTORY: "SET_SWAP_POKEMON_INVENTORY",
  SET_SWAP_POKEMON_BATTLE: "SET_SWAP_POKEMON_BATTLE",
};

export const customDispatch = (dispatch, type, payload) => {
  dispatch({ type, payload });
};
