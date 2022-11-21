import styles from "./home.module.css";
import { useContext, useEffect, useState } from "react";
import {
  getPokemons,
  getPokemonsEnemies,
  requestSwapPokemon,
  updateLevelsAndPlays,
} from "../../utils/requests";
import { ContextModal, ContextUserID } from "../../contexts/contexts";
import Inventory from "../../components/inventory/inventory.component";
import Battlefield from "../../components/battlefield/battlefield.component";
import ContextMenu from "../../components/context-menu/context-menu.component";

const calcRandomNumber = (_min, _max) => {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);
  return Math.floor(Math.random() * (max - min) + min);
};

const requestPokemonsEnemy = async () => {
  const res = await getPokemonsEnemies();
  if (!res.err) {
    res.data.forEach((e) => {
      e.actualHP = e.hp;
    });
    return res.data;
  }
  return null;
};

const getPokemonsUser = async (userID) => {
  const res = await getPokemons(userID);
  if (!res.err) {
    res.data.forEach((e) => {
      e.actualHP = e.hp;
    });
    const inInventory = res.data.filter((e) => !e.selected);
    const inBattle = res.data.filter((e) => e.selected);
    return { battlefield: inBattle, inventory: inInventory };
  }
  return null;
};

const requestFinishedPlay = async (userID) => {
  const res = await updateLevelsAndPlays(userID);
  return res.data;
};

const attack = (firstTeam, secondTeam) => {
  const liveEnemies = [];
  for (let i = 0; i < secondTeam.length; i++) {
    if (secondTeam[i].actualHP > 0) liveEnemies.push(i);
  }
  firstTeam.forEach((e) => {
    if (e.actualHP > 0) {
      const rndm = calcRandomNumber(0, liveEnemies.length - 1);
      const pokemonEnemy = liveEnemies[rndm];
      if (pokemonEnemy === undefined) return;
      secondTeam[pokemonEnemy].actualHP =
        secondTeam[pokemonEnemy].actualHP - e.power < 0
          ? 0
          : secondTeam[pokemonEnemy].actualHP - e.power;
      if (secondTeam[pokemonEnemy].actualHP <= 0) {
        liveEnemies.splice(rndm, 1);
      }
    }
  });
  return [firstTeam, secondTeam, liveEnemies];
};

const HomePage = () => {
  const { userID } = useContext(ContextUserID);
  const { setDataModal } = useContext(ContextModal);
  const [stateSwapPokemon, setStateSwapPokemon] = useState([]);
  const [pokemonsEnemy, setPokemonsEnemy] = useState([]);
  const [pokemonsUser, setPokemonsUser] = useState({
    battlefield: [],
    inventory: [],
  });
  const [contextMenu, setContextMenu] = useState({
    show: false,
    data: [],
    coordenates: { x: 0, y: 0 },
  });

  const handleAttack = async () => {
    const meanSpeedUser =
      pokemonsUser.battlefield.reduce(
        (total, value) => total + value.velocity,
        0
      ) / 3;
    const meanSpeedEnemy =
      pokemonsEnemy.reduce((total, value) => total + value.velocity, 0) / 3;
    let firstTeam = [];
    let secondTeam = [];
    let liveEnemies = [];
    let firstTeamIsUser = false;
    let userTeamWon = true;
    if (meanSpeedUser > meanSpeedEnemy) {
      firstTeamIsUser = true;
      firstTeam = pokemonsUser.battlefield;
      secondTeam = pokemonsEnemy;
    } else {
      firstTeam = pokemonsEnemy;
      secondTeam = pokemonsUser.battlefield;
    }
    [firstTeam, secondTeam, liveEnemies] = attack(firstTeam, secondTeam);
    if (liveEnemies.length !== 0) {
      [secondTeam, firstTeam, liveEnemies] = attack(secondTeam, firstTeam);
      if (liveEnemies.length === 0) userTeamWon = !firstTeamIsUser;
    } else {
      userTeamWon = firstTeamIsUser;
    }
    if (liveEnemies.length === 0) {
      if (userTeamWon) {
        //win
        setDataModal({
          show: true,
          backgroundColor: "green",
          text: "You won the battle!!!",
        });
        //new enemies
        const refreshPokemons = await requestFinishedPlay(userID);

        if (refreshPokemons) {
          setDataModal({
            show: true,
            backgroundColor: "green",
            text: refreshPokemons,
          });
        }
        const newPokemons = await getPokemonsUser(userID);
        setPokemonsUser(newPokemons);
      } else {
        setDataModal({
          show: true,
          backgroundColor: "red",
          text: "You lost the battle :(",
        });

        //reiniciar hp users
        if (firstTeamIsUser) {
          firstTeam.forEach((e) => {
            e.actualHP = e.hp;
            e.level++;
          });
        } else {
          secondTeam.forEach((e) => {
            e.actualHP = e.hp;
            e.level++;
          });
        }
        firstTeamIsUser
          ? setPokemonsUser({ ...pokemonsUser, ...{ battlefield: firstTeam } })
          : setPokemonsUser({
              ...pokemonsUser,
              ...{ battlefield: secondTeam },
            });
      }

      //new enemies
      const newEnemies = await requestPokemonsEnemy();
      if (newEnemies) {
        setPokemonsEnemy(newEnemies);
      } else {
        setDataModal({
          show: true,
          backgroundColor: "green",
          text: "Error getting enemies pokemons",
        });
      }
    } else {
      if (firstTeamIsUser) {
        setPokemonsUser({ ...pokemonsUser, ...{ battlefield: firstTeam } });
        setPokemonsEnemy(secondTeam);
      } else {
        setPokemonsUser({ ...pokemonsUser, ...{ battlefield: secondTeam } });
        setPokemonsEnemy(firstTeam);
      }
    }
  };

  const swapPokemon = async (pokemonBattle) => {
    //stateSwapPokemon[0] is inventory
    //pokemonBattle is battle
    const res = await requestSwapPokemon({
      inventory: stateSwapPokemon[0],
      battle: pokemonBattle,
      userID,
    });
    if (!res.err) {
      if (res.data) {
        const localID = [];
        let copyBattle = pokemonsUser.battlefield;
        let copyInventory = pokemonsUser.inventory;
        copyInventory.forEach((p, i) => {
          if (p.id === stateSwapPokemon[0].id) {
            localID.push(i);
          }
        });
        copyBattle.forEach((p, i) => {
          if (p.id === pokemonBattle.id) {
            localID.push(i);
          }
        });
        const copy = copyInventory[localID[0]];
        copyInventory[localID[0]] = copyBattle[localID[1]];
        copyBattle[localID[1]] = copy;
        return [copyInventory, copyBattle];
      }
    } else {
      setDataModal({
        show: true,
        backgroundColor: "red",
        text: "Error swapping in server",
      });
    }
  };

  useEffect(() => {
    (async () => {
      const newPokemons = await getPokemonsUser(userID);
      if (newPokemons) {
        setPokemonsUser(newPokemons);
        const newEnemies = await requestPokemonsEnemy();
        if (newEnemies) {
          setPokemonsEnemy(newEnemies);
        } else {
          setDataModal({
            show: true,
            backgroundColor: "green",
            text: "Error getting enemies pokemons",
          });
        }
      } else {
        setDataModal({
          show: true,
          backgroundColor: "green",
          text: "Error getting pokemons",
        });
      }
    })();
  }, [setDataModal, userID]);

  const handleSwapInventory = (pokemon) => {
    setStateSwapPokemon([pokemon]);
  };

  const handleSwapBattle = async (pokemon) => {
    if (stateSwapPokemon.length === 1) {
      const swap = await swapPokemon(pokemon);
      setStateSwapPokemon([]);
      setPokemonsUser({ inventory: swap[0], battlefield: swap[1] });
    }
  };

  return (
    <>
      <div className={styles["home_container"]}>
        <Inventory
          setContextMenu={setContextMenu}
          handleSwapInventory={handleSwapInventory}
          pokemons={pokemonsUser.inventory}
        />

        <Battlefield
          handleAttack={handleAttack}
          handleSwapBattle={handleSwapBattle}
          setContextMenu={setContextMenu}
          pokemons={pokemonsUser.battlefield}
          enemy={pokemonsEnemy}
        />
      </div>
      <ContextMenu contextMenu={contextMenu}></ContextMenu>
    </>
  );
};

export default HomePage;
