import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import Battlefield, {
  attack,
  calcMean,
  calcRandomNumber,
  getPokemonsUser,
  handleAttack,
  handleClickAttack,
  IHandleAttack,
  requestPokemonsEnemy,
} from "./battlefield.component";
import { fetch } from "cross-fetch";
import {
  act,
  render,
  fireEvent,
  cleanup,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";

import createFetchMock from "vitest-fetch-mock";
import { GlobalContext, IContext, initialState } from "@contexts/contexts";
import { IPokemonStats, IResponse } from "@utils/requests";
import { dispatch_types } from "@contexts/dispatchs";
import React, { ReactElement, useEffect } from "react";

global.fetch = fetch;
const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();

const useEffectMock: Function = vi.fn();
beforeAll(() => {
  vi.spyOn(React, "useEffect").mockImplementation((e) => useEffectMock());
});
const UserID = 1;
let examplePokemonStats: IPokemonStats = {
  hp: 100,
  id: 1,
  name: "Pikachu",
  level: 1,
  power: 10,
  actualHP: 100,
  velocity: 100,
  pokemon_id: 25,
  evolution_level: 1,
};

vi.mock("@contexts/GlobalContext", () => ({
  useContext: () => ({
    state: initialState,
    dispatch: vi.fn(),
  }),
}));

afterEach(() => {
  Math.floor = originalRandom;
});
const originalRandom = Math.floor;
describe("Battlefield File", (): void => {
  /*beforeAll(async () => {
    // Make the fetch request and save the results to a global variable
    let res2 = await getPokemonsUser(UserID);
    pokemonsUser = res2.data;
    const res = await requestPokemonsEnemy();
    pokemonsEnemy = res.data;
  });*/

  describe("calcRandomNumber function", (): void => {
    it("should be a function", (): void => {
      expect(typeof calcRandomNumber).toBe("function");
    });
    it("should return a number between 2 numbers", (): void => {
      global.Math.floor = () => 4;
      expect(calcRandomNumber(1, 10)).toBe(4);
    });
  });

  describe("getPokemonsUser function", (): void => {
    it("should be a function", (): void => {
      expect(typeof getPokemonsUser).toBe("function");
    });

    it(" should return an empty array if there is an error", async () => {
      // Realizamos la petición fetch
      const data = await getPokemonsUser(UserID);

      // Verificamos que el objeto tenga las propiedades esperadas
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("error");

      // Verificamos que si "error" es true, "data" es un array vacío
      if (data.error) {
        expect(data.data.length).toEqual(0);
      } else {
        // Verificamos que los elementos del array sean objetos con las propiedades esperadas
        for (const element of data.data) {
          expect(element).toHaveProperty("id");
          expect(typeof element.id).toBe("number");
          expect(element).toHaveProperty("pokemon_id");
          expect(typeof element.pokemon_id).toBe("number");
          expect(element).toHaveProperty("user_id");
          expect(typeof element.user_id).toBe("number");
          expect(element).toHaveProperty("selected");
          expect(typeof element.selected).toBe("number");
          expect(element).toHaveProperty("hp");
          expect(typeof element.hp).toBe("number");
          expect(element).toHaveProperty("actualHP");
          expect(typeof element.actualHP).toBe("number");
          expect(element).toHaveProperty("level");
          expect(typeof element.level).toBe("number");
          expect(element).toHaveProperty("velocity");
          expect(typeof element.velocity).toBe("number");
          expect(element).toHaveProperty("power");
          expect(typeof element.power).toBe("number");
          expect(element).toHaveProperty("evolution_level");
          expect(typeof element.evolution_level).toBe("number");
          expect(element).toHaveProperty("id_next_evolution");
          expect(typeof element.id_next_evolution).toBe("string");
          expect(element).toHaveProperty("name");
          expect(typeof element.name).toBe("string");
        }
      }
    });
  });

  describe("requestPokemonsEnemy function", (): void => {
    it("should be a function", (): void => {
      expect(typeof requestPokemonsEnemy).toBe("function");
    });

    it(" should return an empty array if there is an error", async () => {
      // Realizamos la petición fetch
      const data = await requestPokemonsEnemy();

      // Verificamos que el objeto tenga las propiedades esperadas
      expect(data).toHaveProperty("data");
      expect(data).toHaveProperty("error");

      // Verificamos que si "error" es true, "data" es un array vacío
      if (data.error) {
        expect(data.data.length).toBe(0);
      } else {
        // Verificamos que los elementos del array sean objetos con las propiedades esperadas
        for (const element of data.data) {
          expect(element).toHaveProperty("id");
          expect(typeof element.id).toBe("number");
          expect(element).toHaveProperty("pokemon_id");
          expect(typeof element.pokemon_id).toBe("number");
          expect(element).toHaveProperty("user_id");
          expect(typeof element.user_id).toBe("number");
          expect(element).toHaveProperty("selected");
          expect(typeof element.selected).toBe("number");
          expect(element).toHaveProperty("hp");
          expect(typeof element.hp).toBe("number");
          expect(element).toHaveProperty("actualHP");
          expect(typeof element.actualHP).toBe("number");
          expect(element).toHaveProperty("level");
          expect(typeof element.level).toBe("number");
          expect(element).toHaveProperty("velocity");
          expect(typeof element.velocity).toBe("number");
          expect(element).toHaveProperty("power");
          expect(typeof element.power).toBe("number");
          expect(element).toHaveProperty("evolution_level");
          expect(typeof element.evolution_level).toBe("number");
          expect(element).toHaveProperty("id_next_evolution");
          expect(typeof element.id_next_evolution).toBe("string");
          expect(element).toHaveProperty("name");
          expect(typeof element.name).toBe("string");
        }
      }
    });
  });

  describe("calcMean", () => {
    it("should return true if the mean speed of the user's pokemons is greater than the mean speed of the enemy's pokemons", () => {
      const pokemonsUser: IPokemonStats[] = [
        { ...examplePokemonStats, velocity: 100 },
        { ...examplePokemonStats, velocity: 200 },
        { ...examplePokemonStats, velocity: 300 },
      ];

      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, velocity: 50 },
        { ...examplePokemonStats, velocity: 100 },
        { ...examplePokemonStats, velocity: 150 },
      ];

      const result = calcMean(pokemonsUser, pokemonsEnemy);
      expect(result).toBe(true);
    });

    it("should return false if the mean speed of the user's pokemons is lower than the mean speed of the enemy's pokemons", () => {
      const pokemonsUser: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 50, power: 10 },
        { ...examplePokemonStats, actualHP: 50, power: 10 },
        { ...examplePokemonStats, actualHP: 50, power: 10 },
      ];

      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, velocity: 100 },
        { ...examplePokemonStats, velocity: 200 },
        { ...examplePokemonStats, velocity: 300 },
      ];

      const result = calcMean(pokemonsUser, pokemonsEnemy);
      expect(result).toBe(false);
    });

    it("should return false if the mean speed of the user's pokemons is equal than the mean speed of the enemy's pokemons", () => {
      const pokemonsUser: IPokemonStats[] = [
        { ...examplePokemonStats, velocity: 100 },
        { ...examplePokemonStats, velocity: 200 },
        { ...examplePokemonStats, velocity: 300 },
      ];

      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, velocity: 100 },
        { ...examplePokemonStats, velocity: 200 },
        { ...examplePokemonStats, velocity: 300 },
      ];

      const result = calcMean(pokemonsUser, pokemonsEnemy);
      expect(result).toBe(false);
    });
  });

  describe("handleAttack function", () => {
    it("should return win==0 when the user wins", async () => {
      const pokemonsUser: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 50, power: 100, velocity: 100 },
        { ...examplePokemonStats, actualHP: 50, power: 100, velocity: 100 },
        { ...examplePokemonStats, actualHP: 50, power: 100, velocity: 100 },
      ];
      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 100, power: 12, velocity: 0 },
        { ...examplePokemonStats, actualHP: 0, power: 12, velocity: 0 },
        { ...examplePokemonStats, actualHP: 0, power: 20, velocity: 0 },
      ];

      const result: IHandleAttack = await handleAttack(
        pokemonsUser,
        pokemonsEnemy
      );
      expect(result).toHaveProperty("win");
      expect(result.win).toEqual(0);
    });

    it("should return win==1 when the user lose", async () => {
      const pokemonsUser: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 50, power: 0, velocity: 100 },
        { ...examplePokemonStats, actualHP: 50, power: 0, velocity: 100 },
        { ...examplePokemonStats, actualHP: 50, power: 0, velocity: 100 },
      ];
      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 45, power: 100, velocity: 100 },
        { ...examplePokemonStats, actualHP: 40, power: 100, velocity: 100 },
        { ...examplePokemonStats, actualHP: 40, power: 100, velocity: 100 },
      ];

      const result: IHandleAttack = await handleAttack(
        pokemonsUser,
        pokemonsEnemy
      );
      expect(result).toHaveProperty("win");
      expect(result.win).toEqual(1);
    });

    it("should return win==2 when battle continues", async () => {
      const pokemonsUser: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 50, power: 10, velocity: 100 },
        { ...examplePokemonStats, actualHP: 50, power: 10, velocity: 100 },
        { ...examplePokemonStats, actualHP: 50, power: 10, velocity: 100 },
      ];
      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 40, power: 10, velocity: 50 },
        { ...examplePokemonStats, actualHP: 40, power: 10, velocity: 50 },
        { ...examplePokemonStats, actualHP: 40, power: 10, velocity: 50 },
      ];
      const result: IHandleAttack = await handleAttack(
        pokemonsUser,
        pokemonsEnemy
      );
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("enemy");
      expect(result).toHaveProperty("win");
      expect(result.user).toBeInstanceOf(Array);
      expect(result.enemy).toBeInstanceOf(Array);
      expect(result.win).toEqual(2);
      expect(result.enemy[0].actualHP).toBeLessThanOrEqual(40);
      expect(result.enemy[1].actualHP).toBeLessThanOrEqual(40);
      expect(result.enemy[2].actualHP).toBeLessThanOrEqual(40);
    });

    it("should return win==2 when some array is empty", async () => {
      const pokemonsUser: IPokemonStats[] = [];
      const pokemonsEnemy: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 45, power: 10, velocity: 50 },
        { ...examplePokemonStats, actualHP: 40, power: 10, velocity: 50 },
        { ...examplePokemonStats, actualHP: 40, power: 10, velocity: 50 },
      ];

      const expected = {
        user: [],
        enemy: pokemonsEnemy,
        win: 2,
      };
      const result: IHandleAttack = await handleAttack(
        pokemonsUser,
        pokemonsEnemy
      );
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("enemy");
      expect(result).toHaveProperty("win");
      expect(result.user).toBeInstanceOf(Array);
      expect(result.enemy).toBeInstanceOf(Array);
      expect(result.win).toEqual(2);
      expect(result).toEqual(expected);
    });
  });

  describe("attack function", () => {
    it("attack should return an object with the property 'liveEnemies' containing the correct indices for the live enemy Pokémon after the attack", async () => {
      const first: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 100, power: 10 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
      ];
      const second: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 100, power: 30 },
        { ...examplePokemonStats, actualHP: 0, power: 40 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
      ];
      const result = await attack(first, second);
      expect(result).toHaveProperty("first");
      expect(result).toHaveProperty("second");
      expect(result).toHaveProperty("liveEnemies");
      expect(result.liveEnemies).toEqual([0, 2]);
    });

    it("attack should return an object with the property 'first' containing objects with the correct values for the 'actualHP' property after the attack", () => {
      const first: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 100, power: 10 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
      ];
      const second: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 100, power: 30 },
        { ...examplePokemonStats, actualHP: 0, power: 40 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
      ];
      const result = attack(first, second);
      expect(result.first[0].actualHP).toEqual(100);
      expect(result.first[1].actualHP).toEqual(100);
      expect(result.first[2].actualHP).toEqual(100);
      expect(result.second[1].actualHP).toEqual(0);
      expect(result.second[0].actualHP).toBeLessThanOrEqual(100);
      expect(result.second[2].actualHP).toBeLessThanOrEqual(100);
    });

    it("attack should return an object with the property 'liveEnemies' containing [-1] if some input is an empty array", () => {
      const first: IPokemonStats[] = [];
      const second: IPokemonStats[] = [
        { ...examplePokemonStats, actualHP: 100, power: 30 },
        { ...examplePokemonStats, actualHP: 0, power: 40 },
        { ...examplePokemonStats, actualHP: 100, power: 20 },
      ];
      const result = attack(first, second);
      expect(result.liveEnemies[0]).toEqual(-1);
    });
  });

  describe("handleClickAttack", () => {
    it("should continue the game if there are still pokemons alive on both teams", async () => {
      const pokemonsUser = [
        examplePokemonStats,
        examplePokemonStats,
        examplePokemonStats,
      ];
      const pokemonsEnemy = [
        examplePokemonStats,
        examplePokemonStats,
        examplePokemonStats,
      ];
      const setPokemonsUser = vi.fn();
      const setPokemonsEnemy = vi.fn();
      const UserID = 1;
      const dispatch = vi.fn();
      const cfgModal = {
        text: "",
        show: false,
        backgroundColor: "",
      };
      const res: IResponse = {
        data: pokemonsUser,
        error: false,
      };
      const spyHandleAttack = vi
        .spyOn({ handleAttack: handleAttack }, "handleAttack")
        .mockImplementation(async () => ({
          user: pokemonsUser,
          enemy: pokemonsEnemy,
          win: 2,
        }));
      const spyRequestPokemonsEnemy = vi
        .spyOn({ requestPokemonsEnemy: () => {} }, "requestPokemonsEnemy")
        .mockImplementation(() => Promise.resolve(res));
      const spyGetPokemonsUser = vi
        .spyOn({ getPokemonsUser: () => {} }, "getPokemonsUser")
        .mockImplementation(() => Promise.resolve(res));
      const spyCustomDispatch = vi.spyOn(
        { customDispatch: () => {} },
        "customDispatch"
      );
      await handleClickAttack({
        pokemonsUser,
        setPokemonsUser,
        pokemonsEnemy,
        setPokemonsEnemy,
        UserID,
        dispatch,
      });

      //expect(spyHandleAttack).toHaveBeenCalledWith(pokemonsUser, pokemonsEnemy);
      expect(setPokemonsUser).toHaveBeenCalledWith(pokemonsUser);
      expect(setPokemonsEnemy).toHaveBeenCalledWith(pokemonsEnemy);
      expect(spyRequestPokemonsEnemy).not.toHaveBeenCalled();
      expect(spyGetPokemonsUser).not.toHaveBeenCalled();
      expect(spyCustomDispatch).not.toHaveBeenCalled();
    });
  });

  describe("Battlefield Component", (): void => {
    it("renders Battlefield component", async () => {
      vi.useFakeTimers();
      const dispatch = vi.fn();
      const useContextMock: any = (e: any) => ({
        state: initialState,
        dispatch,
      });
      vi.spyOn(React, "useContext").mockImplementation(useContextMock);

      const setPokemonsEnemy = vi.fn();
      const useStateMock: any = (useState: any) => [useState, setPokemonsEnemy];
      vi.spyOn(React, "useState").mockImplementation(useStateMock);
      const { rerender, getByAltText, getByText, findAllByTestId } = render(
        Battlefield()
      );
      expect(React.useContext).toHaveBeenCalledTimes(1);
      expect(React.useState).toHaveBeenCalledTimes(2);
      expect(React.useContext).toHaveBeenCalledOnce();
      await rerender(Battlefield());
      const userPokemons = screen.getByRole("list");
    });
  });
});
