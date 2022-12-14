import styles from "./battlefield.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "@utils/handles";
import { GlobalContext, IAction, IContext } from "@contexts/contexts";
import {
  getPokemonsBattle,
  getPokemonsEnemies,
  IPokemonStats,
  IResponse,
  updateLevelsAndPlays,
} from "@utils/requests";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "@components/context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import { IDataModal } from "@components/modal/modal.component";
const ENV_URL = import.meta.env.VITE_URL;

interface IAttack {
  first: IPokemonStats[];
  second: IPokemonStats[];
  liveEnemies: number[];
}

export interface IHandleAttack {
  user: IPokemonStats[] | [];
  enemy: IPokemonStats[] | [];
  win: number;
}

export const calcRandomNumber = (_min: number, _max: number): number => {
  const min: number = Math.ceil(_min);
  const max: number = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const getPokemonsUser = async (UserID: number): Promise<IResponse> => {
  const res: IResponse = await getPokemonsBattle(UserID);
  return res.error ? { data: [], error: true } : res;
};

export const requestPokemonsEnemy = async (): Promise<IResponse> => {
  const res: IResponse = await getPokemonsEnemies();
  return res.error ? { data: [], error: true } : res;
};

export const calcMean = (
  pokemonsUser: IPokemonStats[],
  pokemonsEnemy: IPokemonStats[]
): boolean => {
  const meanSpeedUser: number =
    pokemonsUser.reduce((total, value) => total + value.velocity, 0) / 3;
  const meanSpeedEnemy: number =
    pokemonsEnemy.reduce((total, value) => total + value.velocity, 0) / 3;
  return meanSpeedUser > meanSpeedEnemy;
};

export const handleAttack = async (
  pokemonsUser: IPokemonStats[],
  pokemonsEnemy: IPokemonStats[]
): Promise<IHandleAttack> => {
  if (!pokemonsUser.length || !pokemonsEnemy.length) {
    return { user: pokemonsUser, enemy: pokemonsEnemy, win: 2 };
  }
  const userIsFaster = calcMean(pokemonsUser, pokemonsEnemy);
  let first: IPokemonStats[] = userIsFaster
    ? pokemonsUser.slice()
    : pokemonsEnemy.slice();
  let second: IPokemonStats[] = userIsFaster
    ? pokemonsEnemy.slice()
    : pokemonsUser.slice();
  let liveEnemies: number[];

  //Attack and reduce HP
  const attackResult = attack(first, second);
  first = attackResult.first;
  second = attackResult.second;
  liveEnemies = attackResult.liveEnemies;

  //If there are some enemy alive, attack again
  if (liveEnemies.length) {
    const secondAttack = attack(second, first);
    second = secondAttack.first;
    first = secondAttack.second;
    liveEnemies = secondAttack.liveEnemies;

    //If there aren't any enemy alive, the first team loose
    if (!liveEnemies.length) {
      //if the user is the first team, he lose
      return userIsFaster
        ? { user: [], enemy: [], win: 1 }
        : { user: [], enemy: [], win: 0 };
    }
  } else {
    return userIsFaster
      ? { user: [], enemy: [], win: 0 }
      : { user: [], enemy: [], win: 1 };
  }

  //If the game continues, return the updated teams
  return userIsFaster
    ? { user: first, enemy: second, win: 2 }
    : { user: second, enemy: first, win: 2 };
};

export const attack = (
  first: IPokemonStats[],
  second: IPokemonStats[]
): IAttack => {
  if (!first.length || !second.length) {
    //liveEnemies has a value preventing an instant win or lose
    return { first, second, liveEnemies: [-1] };
  }
  const liveEnemies: number[] = [];
  for (let i = 0; i < second.length; i++) {
    //check enemies alive
    if (second[i].actualHP > 0) liveEnemies.push(i);
  }

  first.forEach((e) => {
    if (liveEnemies.length && e.actualHP > 0) {
      //who attack needs to be alive
      const rndm = calcRandomNumber(0, liveEnemies.length);
      const pokemonEnemy = second[liveEnemies[rndm]];
      const damage = Math.max(0, pokemonEnemy.actualHP - e.power);
      pokemonEnemy.actualHP = damage;
      if (!pokemonEnemy.actualHP) liveEnemies.splice(rndm, 1);
    }
  });
  return { first, second, liveEnemies };
};

interface IHandleClickAttack {
  pokemonsUser: IPokemonStats[];
  pokemonsEnemy: IPokemonStats[];
  setPokemonsUser: React.Dispatch<React.SetStateAction<IPokemonStats[]>>;
  setPokemonsEnemy: React.Dispatch<React.SetStateAction<IPokemonStats[]>>;
  UserID: number;
  dispatch: React.Dispatch<IAction>;
}

export const handleClickAttack = async ({
  pokemonsUser,
  setPokemonsUser,
  pokemonsEnemy,
  setPokemonsEnemy,
  UserID,
  dispatch,
}: IHandleClickAttack): Promise<void> => {
  const rslt: IHandleAttack = await handleAttack(pokemonsUser, pokemonsEnemy);
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
      const res: IResponse = await updateLevelsAndPlays(UserID);
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
    let res2: IResponse = await getPokemonsUser(UserID);
    setPokemonsUser(res2.data);
  }
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
    return (
      <>
        <div
          className={"max-md:h-[90vh] h-full flex flex-col grow bg-green-500"}
        >
          <div className={"h-5/6 flex flex-row"}>
            <div
              className={
                "max-md:border-r-0 max-md:border-b-1 max-md:w-full h-full flex flex-col w-1/2 justify-center border-r"
              }
            >
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
                    className={
                      "max-md:h-24 w-full h-1/5 grid justify-center justify-center"
                    }
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
                      className={"flex flex-row w-80"}
                    >
                      <div className={"flex flex-col justify-center w-1/2"}>
                        <div
                          className={
                            "max-md:flex max-md:items-center max-md:justify-center"
                          }
                        >
                          <img
                            className={"max-md:h-24 max-md:w-24 h-36"}
                            alt={e.name}
                            src={`${ENV_URL}/image/${e.pokemon_id}`}
                          />
                        </div>
                      </div>
                      <div className={"flex flex-col justify-center w-1/2"}>
                        <div>{e.name}</div>
                        <div>
                          HP
                          <div
                            className={"h-5 bg-green-900"}
                            style={{ width: `${percentageHP}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className={
                "max-md:border-r-0 max-md:border-b-1 max-md:w-full h-full flex flex-col w-1/2 justify-center border-r"
              }
            >
              {pokemonsEnemy.map((e, i) => {
                const percentageHP = (e.actualHP * 100) / e.hp;
                return (
                  <div
                    className={
                      "max-md:h-24 w-full h-1/5 grid justify-center justify-center"
                    }
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
                      className={"flex flex-row w-80"}
                    >
                      <div className={"flex flex-col justify-center w-1/2"}>
                        <div>{e.name}</div>
                        <div>
                          HP
                          <div
                            className={"h-5 bg-green-900"}
                            style={{ width: `${percentageHP}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className={"flex flex-col justify-center w-1/2"}>
                        <div
                          className={
                            "max-md:flex max-md:items-center max-md:justify-center"
                          }
                        >
                          <img
                            className={"max-md:h-24 max-md:w-24 h-36"}
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
          <div className={"h-1/6 flex flex-row"}>
            <button
              onClick={() =>
                handleClickAttack({
                  pokemonsUser,
                  setPokemonsUser,
                  pokemonsEnemy,
                  setPokemonsEnemy,
                  UserID: state.UserID,
                  dispatch,
                })
              }
              className={
                "hover:bg-red-700 w-full f-full rounded-none border-none cursor-pointer bg-red-600 p-0 text-white font-bold"
              }
            >
              ATTACK
            </button>
          </div>
        </div>
      </>
    );
  }, [pokemonsEnemy, pokemonsUser, dispatch, state.statsMenu, state.UserID]);
};

export default Battlefield;
