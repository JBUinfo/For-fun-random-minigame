import React from "react";
import { createRoot, Root } from "react-dom/client";
import { IDataModal } from "@components/modal/modal.component";
import { dispatch_types } from "./dispatchs";

export interface ISwapPokemon {
  battle: number;
  inventory: number;
}

export interface IInitialState {
  UserID: number;
  statsMenu: Root;
  dataModal: IDataModal;
  updateInventory: boolean;
  swapPokemons: ISwapPokemon;
}

export interface IAction {
  payload: any;
  type: dispatch_types;
}

export interface IContext {
  state: IInitialState;
  dispatch: React.Dispatch<IAction>;
}

export const initialState: IInitialState = {
  UserID: -1,
  statsMenu: createRoot(document.getElementById("statsMenu")!),
  updateInventory: false, //new pokemon added
  dataModal: {
    show: false,
    backgroundColor: "",
    text: "",
  },
  swapPokemons: {
    inventory: -1,
    battle: -1,
  },
};

export const reducer = (
  state: IInitialState,
  action: IAction
): IInitialState => {
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
    case dispatch_types.UPDATE_INVENTORY:
      return {
        ...state,
        updateInventory: action.payload,
      };
    default:
      return state;
  }
};

export const GlobalContext = React.createContext<IContext>({
  state: initialState,
  dispatch: () => null,
});
