import styles from "./inventory.module.css";
import { handleMouseMoveToContextMenu } from "../../utils/handles";

const Inventory = ({ pokemons, setContextMenu, handleSwapInventory }) => {
  return pokemons ? (
    <div className={styles["inventory-container"]}>
      {pokemons.map((e, i) => (
        <div
          onClick={() => handleSwapInventory(e)}
          onMouseMove={(event) =>
            handleMouseMoveToContextMenu(event, e, setContextMenu)
          }
          className={styles["pokemon-in-inventory"]}
          key={i}
        >
          <img
            className={styles["img-pokemon-inventory"]}
            alt={e.name}
            src={`http://localhost:8080/image/${e.pokemon_id}`}
          />
          {e.name}
        </div>
      ))}
    </div>
  ) : null;
};

export default Inventory;
