import styles from "./battlefield.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "../../utils/handles";

const Battlefield = ({
  pokemons,
  enemy,
  setContextMenu,
  handleAttack,
  handleSwapBattle,
}) => {
  return pokemons ? (
    <div className={styles["battleflied-container"]}>
      <div className={styles["battle-container"]}>
        <div className={styles["middle-battle"]}>
          {pokemons.map((e, i) => {
            const percentageHP = (e.actualHP * 100) / e.hp;
            return (
              <div
                onClick={() => handleSwapBattle(e)}
                className={styles["row-in-battle"]}
                key={i}
              >
                <div
                  onMouseMove={(event) =>
                    handleMouseMoveToContextMenu(event, e, setContextMenu)
                  }
                  onMouseLeave={() =>
                    handleMouseLeaveToContextMenu(setContextMenu)
                  }
                  className={styles["container-pokemon-battle"]}
                >
                  <div className={styles["box-pokemon-battle"]}>
                    <div className={styles["img-battle-box"]}>
                      <img
                        className={styles["img-pokemon-battlefield"]}
                        alt={e.name}
                        src={`http://localhost:8080/image/${e.pokemon_id}`}
                      />
                    </div>
                  </div>
                  <div className={styles["box-pokemon-battle"]}>
                    <div>{e.name}</div>
                    <div>
                      HP
                      <div
                        className={styles["hp-bar"]}
                        style={{ width: `${percentageHP}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles["middle-battle"]}>
          {enemy.map((e, i) => {
            const percentageHP = (e.actualHP * 100) / e.hp;
            return (
              <div className={styles["row-in-battle"]} key={i}>
                <div
                  onMouseMove={(event) =>
                    handleMouseMoveToContextMenu(event, e, setContextMenu)
                  }
                  onMouseLeave={() =>
                    handleMouseLeaveToContextMenu(setContextMenu)
                  }
                  className={styles["container-pokemon-battle"]}
                >
                  <div className={styles["box-pokemon-battle"]}>
                    <div>{e.name}</div>
                    <div>
                      HP
                      <div
                        className={styles["hp-bar"]}
                        style={{ width: `${percentageHP}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className={styles["box-pokemon-battle"]}>
                    <div className={styles["img-battle-box"]}>
                      <img
                        className={styles["img-pokemon-battlefield"]}
                        alt={e.name}
                        src={`http://localhost:8080/image/${e.pokemon_id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles["buttons-container"]}>
        <button
          onClick={() => handleAttack()}
          className={styles["attack-button"]}
        >
          ATTACK
        </button>
      </div>
    </div>
  ) : null;
};

export default Battlefield;
