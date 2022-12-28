import styles from "./inventory.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "@utils/handles";
import { GlobalContext, IContext } from "@contexts/contexts";
import {
  GET_POKEMONS_INVENTORY,
  IPokemonStats,
  IResponse,
} from "@utils/requests";
import { useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "@components/context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import { useQuery } from "@apollo/client";
const ENV_URL = import.meta.env.VITE_URL;

const Inventory = () => {
  const { state, dispatch }: IContext = useContext(GlobalContext);
  const [pokemonsUser, setPokemonsUser] = useState<IPokemonStats[]>([]);
  const {
    error: errorPokemonsInventory,
    data,
    refetch,
  } = useQuery(GET_POKEMONS_INVENTORY, {
    variables: { user_id: state.UserID },
  });
  useEffect(() => {
    if (errorPokemonsInventory !== undefined || data !== undefined) {
      if (errorPokemonsInventory) {
        customDispatch(dispatch, {
          type: dispatch_types.SET_DATA_MODAL,
          payload: {
            backgroundColor: "red",
            text: "Error getting inventory",
          },
        });
      } else {
        const dataEdit = data.getInventoryFromUserID.map((e: any) => ({
          actual_hp: e.actual_hp,
          evolution_level: e.evolution_level,
          hp: e.hp,
          id: e.id,
          level: e.level,
          name: e.pokemon_id.name,
          pokemon_id: e.pokemon_id.id,
          power: e.power,
          speed: e.speed,
        }));
        setPokemonsUser(dataEdit ?? []);
      }
    }
  }, [, data, errorPokemonsInventory]);

  useEffect(() => {
    if (state.swapPokemons.inventory === -1) {
      refetch();
    }
  }, [state.swapPokemons.inventory]);

  useEffect(() => {
    if (state.updateInventory) {
      customDispatch(dispatch, {
        type: dispatch_types.UPDATE_INVENTORY,
        payload: false,
      });
      refetch({ user_id: state.UserID });
    }
  }, [state.updateInventory]);

  return useMemo(() => {
    return (
      <>
        <div
          className={
            "max-md:max-w-none max-md:flex-row max-md:max-h-14 max-md:w-full max-md:overflow-x-scroll h-full flex flex-col grow overflow-y-scroll max-w-[240px] bg-emerald-900"
          }
        >
          {pokemonsUser.map((e, i) => (
            <div
              onClick={() =>
                customDispatch(dispatch, {
                  type: dispatch_types.SET_SWAP_POKEMON_INVENTORY,
                  payload: e.id,
                })
              }
              onMouseMove={(event: React.MouseEvent) => {
                ContextMenu(
                  handleMouseMoveToContextMenu(event, e, state.statsMenu)
                );
              }}
              onMouseLeave={() =>
                ContextMenu(handleMouseLeaveToContextMenu(state.statsMenu))
              }
              className={
                "max-md:border-b-0 max-md:border-r max-md:p-4  h-14 w-full flex flex-row items-center justify-center border-b text-white"
              }
              key={i}
            >
              <img
                className={"max-h-full"}
                alt={e.name}
                src={`${ENV_URL}/v1/images/${e.pokemon_id}`}
              />
              {e.name}
            </div>
          ))}
        </div>
      </>
    );
  }, [pokemonsUser, state.statsMenu, dispatch]);
};

export default Inventory;
