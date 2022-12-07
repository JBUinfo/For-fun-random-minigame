import styles from "./home.module.css";
import { useContext, useEffect, useMemo } from "react";
import { GlobalContext } from "../../contexts/contexts";
import { requestSwapPokemon } from "../../utils/requests";
import Inventory from "../../components/inventory/inventory.component";
import Battlefield from "../../components/battlefield/battlefield.component";
import { customDispatch, dispatch_types } from "../../contexts/dispatchs";

const HomePage = () => {
  const [state, dispatch] = useContext(GlobalContext);
  useEffect(() => {
    if (
      state.swapPokemons.inventory !== -1 &&
      state.swapPokemons.battle !== -1
    ) {
      (async () => {
        const res = await requestSwapPokemon({
          ...state.swapPokemons,
          userID: state.UserID,
        });
        if (!res.err) {
          customDispatch(dispatch, dispatch_types.RESET_SWAP, null);
        } else {
          customDispatch(dispatch, dispatch_types.SET_DATA_MODAL, {
            backgroundColor: "red",
            text: "Error swapping in server",
          });
        }
      })();
    }
  }, [state.UserID, state.swapPokemons, dispatch]);
  return useMemo(() => {
    return (
      <>
        <div className={styles["home_container"]}>
          <Inventory />
          <Battlefield />
        </div>
      </>
    );
  }, []);
};

export default HomePage;
