import styles from "./inventory.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "@utils/handles";
import { GlobalContext, IContext } from "@contexts/contexts";
import {
  getPokemonsInventory,
  IPokemonStats,
  IResponse,
} from "@utils/requests";
import { useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "@components/context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
const ENV_URL = import.meta.env.VITE_URL;

const Inventory = () => {
  const { state, dispatch }: IContext = useContext(GlobalContext);
  const [pokemonsUser, setPokemonsUser] = useState<IPokemonStats[]>([]);

  useEffect(() => {
    if (state.swapPokemons.inventory === -1 || state.updateInventory) {
      (async () => {
        const res: IResponse = await getPokemonsInventory(state.UserID);
        if (!res.error) {
          setPokemonsUser(res.data);
        } else {
          customDispatch(dispatch, {
            type: dispatch_types.SET_DATA_MODAL,
            payload: {
              backgroundColor: "red",
              text: "Error getting pokemons in inventory",
            },
          });
        }
        customDispatch(dispatch, {
          type: dispatch_types.UPDATE_INVENTORY,
          payload: false,
        });
      })();
    }
  }, [state.swapPokemons, state.updateInventory, state.UserID, dispatch]);

  return useMemo(() => {
    return (
      <>
        <div className={styles["inventory-container"]}>
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
              className={styles["pokemon-in-inventory"]}
              key={i}
            >
              <img
                className={styles["img-pokemon-inventory"]}
                alt={e.name}
                src={`${ENV_URL}/image/${e.pokemon_id}`}
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
