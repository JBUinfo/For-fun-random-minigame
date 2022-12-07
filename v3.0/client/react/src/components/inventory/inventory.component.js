import styles from "./inventory.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "../../utils/handles";
import { GlobalContext } from "../../contexts/contexts";
import { getPokemonsInventory } from "../../utils/requests";
import { useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "../context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "../../contexts/dispatchs";

const Inventory = () => {
  const URL = "http://localhost:8080";
  const [state, dispatch] = useContext(GlobalContext);
  const [pokemonsUser, setPokemonsUser] = useState([]);

  useEffect(() => {
    if (state.swapPokemons.inventory === -1) {
      (async () => {
        const res = await getPokemonsInventory(state.UserID);
        if (!res.err) {
          setPokemonsUser(res.data);
        } else {
          customDispatch(dispatch, dispatch_types.SET_DATA_MODAL, {
            backgroundColor: "red",
            title: "Error getting pokemons in inventory",
          });
        }
      })();
    }
  }, [state.swapPokemons, state.UserID, dispatch]);

  return useMemo(() => {
    return (
      <>
        <div className={styles["inventory-container"]}>
          {pokemonsUser.map((e, i) => (
            <div
              onClick={() =>
                customDispatch(
                  dispatch,
                  dispatch_types.SET_SWAP_POKEMON_INVENTORY,
                  e.id
                )
              }
              onMouseMove={(event) => {
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
                src={`${URL}/image/${e.pokemon_id}`}
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
