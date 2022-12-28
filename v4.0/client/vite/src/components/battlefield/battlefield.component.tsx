import styles from "./battlefield.module.css";
import {
  handleMouseLeaveToContextMenu,
  handleMouseMoveToContextMenu,
} from "@utils/handles";
import { GlobalContext, IAction, IContext } from "@contexts/contexts";
import {
  GET_POKEMONS_NAME,
  GET_POKEMONS_TEAM,
  getPokemonsEnemies,
  IPokemonStats,
  IResponse,
  UPDATE_FIGHTS_AND_SCORES,
} from "@utils/requests";
import React, { useContext, useEffect, useMemo, useState } from "react";
import ContextMenu from "@components/context-menu/context-menu.component";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import { IDataModal } from "@components/modal/modal.component";
import img_background from "./imgs/background.jpg";
import VS from "./imgs/VS.png";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client";
import { client } from "@utils/apollo";
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

export const requestPokemonsEnemy = async (): Promise<IResponse> => {
  const res: IResponse = await getPokemonsEnemies();
  return res.error ? { data: [], error: true } : res;
};

export const calcMean = (
  pokemonsUser: IPokemonStats[],
  pokemonsEnemy: IPokemonStats[]
): boolean => {
  const meanSpeedUser: number =
    pokemonsUser.reduce((total, value) => total + value.speed, 0) / 3;
  const meanSpeedEnemy: number =
    pokemonsEnemy.reduce((total, value) => total + value.speed, 0) / 3;
  return meanSpeedUser > meanSpeedEnemy;
};

export const handleAttack = (
  pokemonsUser: IPokemonStats[],
  pokemonsEnemy: IPokemonStats[]
): IHandleAttack => {
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
  const attackResult = reduceHP(first, second);
  first = attackResult.first;
  second = attackResult.second;
  liveEnemies = attackResult.liveEnemies;

  //If there arent any enemy alive, attack again
  if (!liveEnemies.length) {
    return userIsFaster
      ? { user: [], enemy: [], win: 1 }
      : { user: [], enemy: [], win: 0 };
  }

  const secondAttack = reduceHP(second, first);
  second = secondAttack.first;
  first = secondAttack.second;
  liveEnemies = secondAttack.liveEnemies;

  //If there aren't any enemy alive, the first team loose
  if (!liveEnemies.length) {
    //if the user is the first team, he lose
    return userIsFaster
      ? { user: [], enemy: [], win: 0 }
      : { user: [], enemy: [], win: 1 };
  }

  //If the game continues, return the updated teams
  return userIsFaster
    ? { user: first, enemy: second, win: 2 }
    : { user: second, enemy: first, win: 2 };
};

export const reduceHP = (
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

const normalizePokemon = (data: any) =>
  data.map((e: any) => ({
    actualHP: e.actual_hp,
    evolution_level: e.evolution_level,
    hp: e.hp,
    id: e.id,
    level: e.level,
    name: e.pokemon_id.name,
    pokemon_id: e.pokemon_id.id,
    power: e.power,
    speed: e.speed,
  }));
const Battlefield = (): JSX.Element => {
  const { state, dispatch }: IContext = useContext(GlobalContext);
  const [pokemonsEnemy, setPokemonsEnemy] = useState<IPokemonStats[]>([]);
  const [pokemonsUser, setPokemonsUser] = useState<IPokemonStats[]>([]);
  const {
    error: errorPokemonsUsers,
    data,
    refetch,
  } = useQuery(GET_POKEMONS_TEAM, {
    variables: { user_id: state.UserID },
  });

  useEffect(() => {
    if (errorPokemonsUsers !== undefined || data !== undefined) {
      if (errorPokemonsUsers) {
        customDispatch(dispatch, {
          type: dispatch_types.SET_DATA_MODAL,
          payload: {
            backgroundColor: "red",
            text: "Error getting pokemons",
          },
        });
      } else {
        const dataEdit = normalizePokemon(data.getTeamFromUserID);
        setPokemonsUser(dataEdit || []);
        generateEnemies(dataEdit);
      }
    }
  }, [data, errorPokemonsUsers]);
  useEffect(() => {
    if (state.swapPokemons.battle === -1) {
      refetch();
    }
  }, [state.swapPokemons.battle]);
  const generateEnemies = async (dataEdit: IPokemonStats[]) => {
    const ids = (
      await GET_POKEMONS_NAME(client, [
        calcRandomNumber(1, 905),
        calcRandomNumber(1, 905),
        calcRandomNumber(1, 905),
      ])
    ).data.getPokemonsName;

    const enemies: IPokemonStats[] = dataEdit.map(
      (e: IPokemonStats, i: number) => {
        const upper = (num: number) => num * 1.15;
        const lower = (num: number) => num * 0.85;
        const hp = calcRandomNumber(lower(e.hp), upper(e.hp));
        return {
          actualHP: hp,
          hp: hp,
          pokemon_id: ids[i].id,
          name: ids[i].name,
          level: calcRandomNumber(lower(e.level), upper(e.level)),
          power: calcRandomNumber(lower(e.power), upper(e.power)),
          speed: calcRandomNumber(lower(e.speed), upper(e.speed)),
          id: 0,
          evolution_level: 0,
        };
      }
    );

    setPokemonsEnemy(enemies);
  };

  const handleClickAttack = async (): Promise<IDataModal | undefined> => {
    const rslt: IHandleAttack = handleAttack(pokemonsUser, pokemonsEnemy);
    if (rslt.win === 2) {
      //continue
      setPokemonsEnemy(rslt.enemy);
      setPokemonsUser(rslt.user);
      return undefined;
    }
    if (!rslt.win) {
      const dataEdit = normalizePokemon(data.getTeamFromUserID);
      setPokemonsUser(dataEdit || []);
      generateEnemies(dataEdit);
      //lost
      return {
        text: "You lost the battle :(",
        show: true,
        backgroundColor: "red",
      };
    }
    const res = (await UPDATE_FIGHTS_AND_SCORES(client, state.UserID)).data
      .updateUser;
    if (res == 1 || res == 3) {
      customDispatch(dispatch, {
        type: dispatch_types.UPDATE_INVENTORY,
        payload: true,
      });
    }
    refetch();
    customDispatch(dispatch, {
      type: dispatch_types.SET_DATA_MODAL,
      payload: {
        text: [
          "You won the battle!!!",
          "You have a new pokemon!!!",
          "One or more pokemons have evolved!!!",
          "You have a new pokemon and someone in your team has evolved!!!",
        ][res],
        backgroundColor: "green",
      },
    });
  };

  return useMemo(() => {
    return (
      <>
        <div
          className={`relative bg-bottom bg-cover max-md:h-[90vh] h-full flex flex-col grow`}
        >
          <img
            src={img_background}
            className="absolute h-full w-full blur-md -z-10"
          />
          <div className={"relative h-[85%] flex flex-row"}>
            <div className="absolute h-full w-full flex justify-center items-center">
              <img src={VS} />
            </div>
            {[pokemonsUser, pokemonsEnemy].map((e, i) => (
              <div
                key={i}
                className={
                  "absolute max-md:w-full h-full flex flex-col w-1/2 justify-center" +
                  (i ? " right-0" : "")
                }
              >
                {e.map((f, index) => {
                  const percentageHP = (f.actualHP * 100) / f.hp;
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        !i
                          ? customDispatch(dispatch, {
                              type: dispatch_types.SET_SWAP_POKEMON_BATTLE,
                              payload: f.id,
                            })
                          : null
                      }
                      className={
                        "max-md:h-24 w-full h-1/5 grid justify-center justify-center"
                      }
                    >
                      <div
                        onMouseMove={(event: React.MouseEvent) =>
                          ContextMenu(
                            handleMouseMoveToContextMenu(
                              event,
                              f,
                              state.statsMenu
                            )
                          )
                        }
                        onMouseLeave={() =>
                          ContextMenu(
                            handleMouseLeaveToContextMenu(state.statsMenu)
                          )
                        }
                        className={
                          "flex flex-row w-80 " + (!i ? "" : "flex-row-reverse")
                        }
                      >
                        <div className={"flex flex-col justify-center w-1/2"}>
                          <div
                            className={
                              "max-md:flex max-md:items-center max-md:justify-center"
                            }
                          >
                            <img
                              className={"max-md:h-24 max-md:w-24 h-36"}
                              alt={f.name}
                              src={`${ENV_URL}/v1/images/${f.pokemon_id}`}
                            />
                          </div>
                        </div>
                        <div className={"flex flex-col justify-center w-1/2"}>
                          <div>{f.name.toUpperCase()}</div>
                          <div>
                            HP
                            <div
                              className={
                                "transition-all duration-[1500ms] h-5 bg-green-900"
                              }
                              style={{ width: `${percentageHP}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className={"h-[15%] flex flex-row justify-center"}>
            <button
              onClick={async (e) => {
                let a: any = e.currentTarget;
                if (a.tagName != "BUTTON") {
                  a = a.parentNode;
                }
                a.disabled = true;
                setTimeout(() => {
                  a.disabled = false;
                }, 1500);
                const modal = await handleClickAttack();
                if (modal) {
                  customDispatch(dispatch, {
                    type: dispatch_types.SET_DATA_MODAL,
                    payload: modal,
                  });
                }
              }}
              className={`hover:animate-change-background bg-[length:150%_150%] bg-gradient-to-r from-[#333333] to-[#dd1818]  hover:scale-105 w-1/6 h-1/2 rounded-xl border-none cursor-pointer p-0 text-white font-bold`}
            >
              <span>ATTACK</span>
            </button>
          </div>
        </div>
      </>
    );
  }, [pokemonsEnemy, pokemonsUser, dispatch, state.statsMenu, state.UserID]);
};

export default Battlefield;
