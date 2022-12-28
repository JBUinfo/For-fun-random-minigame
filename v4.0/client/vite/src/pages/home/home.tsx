import styles from "./home.module.css";
import { useContext, useEffect, useMemo } from "react";
import {
  GlobalContext,
  IAction,
  IContext,
  IInitialState,
} from "@contexts/contexts";
import { IResponse, SWAP_POKEMONS } from "@utils/requests";
import Inventory from "@components/inventory/inventory.component";
import Battlefield from "@components/battlefield/battlefield.component";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import { client } from "@utils/apollo";

const HomePage = (): JSX.Element => {
  const { state, dispatch }: IContext = useContext(GlobalContext);
  useEffect(() => {
    if (state.swapPokemons.inventory > -1 && state.swapPokemons.battle > -1) {
      (async () => {
        await SWAP_POKEMONS(
          client,
          state.swapPokemons.inventory,
          state.swapPokemons.battle
        );
        customDispatch(dispatch, {
          type: dispatch_types.RESET_SWAP,
          payload: null,
        });
      })();
    }
  }, [state.UserID, state.swapPokemons, dispatch]);
  return useMemo(() => {
    return (
      <>
        <div className={"max-md:flex-col flex h-screen w-screen"}>
          <Inventory />
          <Battlefield />
        </div>
      </>
    );
  }, []);
};

export default HomePage;
