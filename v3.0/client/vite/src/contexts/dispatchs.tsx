import { IAction } from "./contexts";

export enum dispatch_types {
  SET_USER_ID,
  SET_STATS_MENU,
  SET_DATA_MODAL,
  CLOSE_MODAL,
  RESET_SWAP,
  SET_SWAP_POKEMON_INVENTORY,
  SET_SWAP_POKEMON_BATTLE,
  UPDATE_INVENTORY,
}

export const customDispatch = (
  dispatch: React.Dispatch<IAction>,
  action: IAction
): void => {
  dispatch(action);
};
