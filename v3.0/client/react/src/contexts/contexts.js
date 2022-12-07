import React from "react";
import { createRoot } from "react-dom/client";
import { dispatch_types } from "./dispatchs";

export const initialState = {
  UserID: null,
  statsMenu: createRoot(document.getElementById("statsMenu")),
  dataModal: {
    show: false,
    backgroundColor: "",
    title: "",
  },
  swapPokemons: {
    inventory: -1,
    battle: -1,
  },
};

export const reducer = (state, action) => {
  switch (action.type) {
    case dispatch_types.SET_USER_ID:
      return { ...state, UserID: action.payload };
    case dispatch_types.SET_STATS_MENU:
      return { ...state, statsMenu: action.payload };
    case dispatch_types.SET_DATA_MODAL:
      return { ...state, dataModal: { show: true, ...action.payload } };
    case dispatch_types.CLOSE_MODAL:
      return { ...state, dataModal: initialState.dataModal };
    case dispatch_types.RESET_SWAP:
      return {
        ...state,
        swapPokemons: initialState.swapPokemons,
      };
    case dispatch_types.SET_SWAP_POKEMON_INVENTORY:
      return {
        ...state,
        swapPokemons: { ...state.swapPokemons, inventory: action.payload },
      };
    case dispatch_types.SET_SWAP_POKEMON_BATTLE:
      return {
        ...state,
        swapPokemons: { ...state.swapPokemons, battle: action.payload },
      };
    default:
      return state;
  }
};

export const GlobalContext = React.createContext(null);
