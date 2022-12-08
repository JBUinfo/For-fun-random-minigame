import styles from "./battlefield.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "@utils/handles";
import { GlobalContext, IContext } from "@contexts/contexts";
import {
  getPokemonsBattle,
  getPokemonsEnemies,
  IPokemonStats,
  IResponse,
  updateLevelsAndPlays,
} from "@utils/requests";
import React, { memo, useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "@components/context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import { IDataModal } from "@components/modal/modal.component";
const ENV_URL = import.meta.env.VITE_URL;

interface IAttack {
  first: IPokemonStats[];
  second: IPokemonStats[];
  liveEnemies: number[];
}

interface IHandleAttack {
  user: IPokemonStats[] | [];
  enemy: IPokemonStats[] | [];
  win: number;
}

const calcRandomNumber = (_min: number, _max: number): number => {
  const min: number = Math.ceil(_min);
  const max: number = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min);
};

const getPokemonsUser = async (UserID: number): Promise<IResponse> => {
  return await getPokemonsBattle(UserID);
};

const requestPokemonsEnemy = async (): Promise<IResponse> => {
  return await getPokemonsEnemies();
};

const calcMean = (
  pokemonsUser: IPokemonStats[],
  pokemonsEnemy: IPokemonStats[]
): boolean => {
  const meanSpeedUser: number =
    pokemonsUser.reduce((total, value) => total + value.velocity, 0) / 3;
  const meanSpeedEnemy: number =
    pokemonsEnemy.reduce((total, value) => total + value.velocity, 0) / 3;
  return meanSpeedUser > meanSpeedEnemy;
};

const handleAttack = async (
  pokemonsUser: IPokemonStats[],
  pokemonsEnemy: IPokemonStats[]
): Promise<IHandleAttack> => {
  //Assigns who will fight first based on speed calculated in calcMean()
  let userIsFaster: boolean = calcMean(pokemonsUser, pokemonsEnemy);

  //Attack and reduce HP
  let { first, second, liveEnemies }: IAttack = userIsFaster
    ? attack(pokemonsUser.slice(), pokemonsEnemy.slice())
    : attack(pokemonsEnemy.slice(), pokemonsUser.slice());

  if (liveEnemies.length) {
    //if there are some enemy alive
    const secondAttack: IAttack = attack(second, first);
    second = secondAttack.first;
    first = secondAttack.second;
    liveEnemies = secondAttack.liveEnemies;

    //if there arent any enemy alive, the first team loose
    //if the user is the first team, he lose
    if (!liveEnemies.length) {
      return !userIsFaster
        ? { user: [], enemy: [], win: 1 }
        : { user: [], enemy: [], win: 0 };
    }
  } else {
    //first team won
    return userIsFaster
      ? { user: [], enemy: [], win: 1 }
      : { user: [], enemy: [], win: 0 };
  }

  //continue
  if (userIsFaster) {
    return { user: first, enemy: second, win: 2 };
  } else {
    return { user: second, enemy: first, win: 2 };
  }
};

const attack = (first: IPokemonStats[], second: IPokemonStats[]): IAttack => {
  const liveEnemies: number[] = [];
  for (let i = 0; i < second.length; i++) {
    //check enemies alive
    if (second[i].actualHP > 0) liveEnemies.push(i);
  }
  first.forEach((e) => {
    if (liveEnemies.length && e.actualHP > 0) {
      //who attack needs to be alive
      const rndm = calcRandomNumber(0, liveEnemies.length);
      const pokemonEnemy = liveEnemies[rndm];
      if (second[pokemonEnemy].actualHP - e.power < 0) {
        second[pokemonEnemy].actualHP = 0;
      } else {
        second[pokemonEnemy].actualHP -= e.power;
      }

      if (second[pokemonEnemy].actualHP <= 0) {
        liveEnemies.splice(rndm, 1);
      }
    }
  });
  return { first, second, liveEnemies };
};

const Battlefield = (): JSX.Element => {
  const { state, dispatch }: IContext = useContext(GlobalContext);
  const [pokemonsEnemy, setPokemonsEnemy] = useState<IPokemonStats[]>([]);
  const [pokemonsUser, setPokemonsUser] = useState<IPokemonStats[]>([]);

  useEffect(() => {
    if (state.swapPokemons.battle === -1) {
      (async () => {
        let res2 = await getPokemonsUser(state.UserID);
        setPokemonsUser(res2.data);
        if (res2.error)
          customDispatch(dispatch, {
            type: dispatch_types.SET_DATA_MODAL,
            payload: {
              backgroundColor: "red",
              text: "Error getting pokemons",
            },
          });

        if (!pokemonsEnemy.length) {
          const res = await requestPokemonsEnemy();
          setPokemonsEnemy(res.data);
        }
      })();
    }
  }, [state.UserID, pokemonsEnemy.length, dispatch, state.swapPokemons.battle]);

  return useMemo(() => {
    const hdlAttack = async () => {
      const rslt: IHandleAttack = await handleAttack(
        pokemonsUser,
        pokemonsEnemy
      );

      if (rslt.win === 2) {
        //continue
        setPokemonsEnemy(rslt.enemy);
        setPokemonsUser(rslt.user);
      } else {
        let res: IResponse = await requestPokemonsEnemy();
        setPokemonsEnemy(res.data);
        let cfgModal: IDataModal = {
          text: "",
          show: true,
          backgroundColor: "",
        };
        if (rslt.win) {
          //win
          cfgModal = {
            text: "You won the battle!!!",
            show: true,
            backgroundColor: "green",
          };
          const res: IResponse = await updateLevelsAndPlays(state.UserID);
          if (res.data) {
            cfgModal = {
              text: res.data,
              show: true,
              backgroundColor: "green",
            };
            if (res.data.includes("RECEIVED")) {
              customDispatch(dispatch, {
                type: dispatch_types.UPDATE_INVENTORY,
                payload: true,
              });
            }
          }
        } else {
          //lost
          cfgModal = {
            text: "You lost the battle :(",
            show: true,
            backgroundColor: "red",
          };
        }
        customDispatch(dispatch, {
          type: dispatch_types.SET_DATA_MODAL,
          payload: cfgModal,
        });
        let res2: IResponse = await getPokemonsUser(state.UserID);
        setPokemonsUser(res2.data);
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
                      customDispatch(dispatch, {
                        type: dispatch_types.SET_SWAP_POKEMON_BATTLE,
                        payload: e.id,
                      })
                    }
                    className={styles["row-in-battle"]}
                    key={i}
                  >
                    <div
                      onMouseMove={(event: React.MouseEvent) =>
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
                            src={`${ENV_URL}/image/${e.pokemon_id}`}
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
                            src={`${ENV_URL}/image/${e.pokemon_id}`}
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
