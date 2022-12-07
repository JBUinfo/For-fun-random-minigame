import styles from "./battlefield.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "../../utils/handles";
import { GlobalContext } from "../../contexts/contexts";
import {
  getPokemonsBattle,
  getPokemonsEnemies,
  updateLevelsAndPlays,
} from "../../utils/requests";
import { memo, useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "../context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "../../contexts/dispatchs";

const calcRandomNumber = (_min, _max) => {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min);
};

const getPokemonsUser = async (userID) => {
  const res = await getPokemonsBattle(userID);
  return !res.err
    ? res
    : {
        data: [],
        err: {
          backgroundColor: "red",
          text: "Error getting pokemons",
        },
      };
};

const requestPokemonsEnemy = async () => {
  const res = await getPokemonsEnemies();
  return !res.err
    ? res
    : {
        data: [],
        err: {
          backgroundColor: "green",
          text: "Error getting enemies pokemons",
        },
      };
};

const calcMean = (pokemonsUser, pokemonsEnemy) => {
  const meanSpeedUser =
    pokemonsUser.reduce((total, value) => total + value.velocity, 0) / 3;
  const meanSpeedEnemy =
    pokemonsEnemy.reduce((total, value) => total + value.velocity, 0) / 3;
  return meanSpeedUser > meanSpeedEnemy;
};

const handleAttack = async (pokemonsUser, pokemonsEnemy) => {
  //Assigns who will fight first based on speed calculated in calcMean()
  let liveEnemies = [];
  let userIsFaster = calcMean(pokemonsUser, pokemonsEnemy);
  let first = [];
  let second = [];
  [first, second] = userIsFaster
    ? [pokemonsUser.slice(), pokemonsEnemy.slice()]
    : [pokemonsEnemy.slice(), pokemonsUser.slice()];

  //Attack and reduce HP
  [first, second, liveEnemies] = attack(first, second);
  if (liveEnemies.length) {
    //if there are some enemy alive
    [second, first, liveEnemies] = attack(second, first);

    //if there arent any enemy alive, the first team loose
    //if the user is the first team, he lose
    if (!liveEnemies.length) {
      return !userIsFaster ? { win: 1 } : { win: 0 };
    }
  } else {
    //first team won
    return userIsFaster ? { win: 1 } : { win: 0 };
  }

  //continue
  if (userIsFaster) {
    return { user: first, enemy: second, win: 2 };
  } else {
    return { user: second, enemy: first, win: 2 };
  }
};

const attack = (firstTeam, secondTeam) => {
  const liveEnemies = [];
  for (let i = 0; i < secondTeam.length; i++) {
    //check enemies alive
    if (secondTeam[i].actualHP > 0) liveEnemies.push(i);
  }
  firstTeam.forEach((e) => {
    if (liveEnemies.length && e.actualHP > 0) {
      //who attack needs to be alive
      const rndm = calcRandomNumber(0, liveEnemies.length);
      const pokemonEnemy = liveEnemies[rndm];
      if (secondTeam[pokemonEnemy].actualHP - e.power < 0) {
        secondTeam[pokemonEnemy].actualHP = 0;
      } else {
        secondTeam[pokemonEnemy].actualHP -= e.power;
      }

      if (secondTeam[pokemonEnemy].actualHP <= 0) {
        liveEnemies.splice(rndm, 1);
      }
    }
  });
  return [firstTeam, secondTeam, liveEnemies];
};

const Battlefield = () => {
  const [state, dispatch] = useContext(GlobalContext);
  const [pokemonsEnemy, setPokemonsEnemy] = useState([]);
  const [pokemonsUser, setPokemonsUser] = useState([]);
  const URL = "http://localhost:8080";

  useEffect(() => {
    if (state.swapPokemons.battle === -1) {
      (async () => {
        let res2 = await getPokemonsUser(state.UserID);
        setPokemonsUser(res2.data);
        if (res2.err)
          customDispatch(dispatch, dispatch_types.SET_DATA_MODAL, res2.err);

        if (!pokemonsEnemy.length) {
          const res = await requestPokemonsEnemy();
          setPokemonsEnemy(res.data);
        }
      })();
    }
  }, [state.UserID, pokemonsEnemy.length, dispatch, state.swapPokemons.battle]);

  return useMemo(() => {
    const hdlAttack = async () => {
      const rslt = await handleAttack(pokemonsUser, pokemonsEnemy);

      if (rslt.win === 2) {
        //continue
        setPokemonsEnemy(rslt.enemy);
        setPokemonsUser(rslt.user);
      } else {
        let res = await requestPokemonsEnemy();
        let res2 = await getPokemonsUser(state.UserID);
        setPokemonsEnemy(res.data);
        setPokemonsUser(res2.data);
        let cfgModal = {};
        if (rslt.win) {
          //win
          cfgModal = {
            backgroundColor: "green",
            text: "You won the battle!!!",
          };
          const res = await updateLevelsAndPlays(state.UserID);
          if (res.data) {
            cfgModal = {
              backgroundColor: "green",
              text: res.data,
            };
          }
        } else {
          //lost
          cfgModal = {
            backgroundColor: "red",
            text: "You lost the battle :(",
          };
        }
        customDispatch(dispatch, dispatch_types.SET_DATA_MODAL, cfgModal);
      }
    };
    return (
      <>
        <div className={styles["battleflied-container"]}>
          <div className={styles["battle-container"]}>
            <div className={styles["middle-battle"]}>
              {pokemonsUser.map((e, i) => {
                const percentageHP = (e.actualHP * 100) / e.hp;
                return (
                  <div
                    onClick={() =>
                      customDispatch(
                        dispatch,
                        dispatch_types.SET_SWAP_POKEMON_BATTLE,
                        e.id
                      )
                    }
                    className={styles["row-in-battle"]}
                    key={i}
                  >
                    <div
                      onMouseMove={(event) =>
                        ContextMenu(
                          handleMouseMoveToContextMenu(
                            event,
                            e,
                            state.statsMenu
                          )
                        )
                      }
                      onMouseLeave={() =>
                        ContextMenu(
                          handleMouseLeaveToContextMenu(state.statsMenu)
                        )
                      }
                      className={styles["container-pokemon-battle"]}
                    >
                      <div className={styles["box-pokemon-battle"]}>
                        <div className={styles["img-battle-box"]}>
                          <img
                            className={styles["img-pokemon-battlefield"]}
                            alt={e.name}
                            src={`${URL}/image/${e.pokemon_id}`}
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
              {pokemonsEnemy.map((e, i) => {
                const percentageHP = (e.actualHP * 100) / e.hp;
                return (
                  <div className={styles["row-in-battle"]} key={i}>
                    <div
                      onMouseMove={(event) =>
                        ContextMenu(
                          handleMouseMoveToContextMenu(
                            event,
                            e,
                            state.statsMenu
                          )
                        )
                      }
                      onMouseLeave={() =>
                        ContextMenu(
                          handleMouseLeaveToContextMenu(state.statsMenu)
                        )
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
                            src={`${URL}/image/${e.pokemon_id}`}
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
              onClick={() => hdlAttack()}
              className={styles["attack-button"]}
            >
              ATTACK
            </button>
          </div>
        </div>
      </>
    );
  }, [pokemonsEnemy, pokemonsUser, dispatch, state.statsMenu, state.UserID]);
};

export default memo(Battlefield);
