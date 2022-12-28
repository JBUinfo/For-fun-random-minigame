import styles from "./context-menu.module.css";
import background from "@assets/context_menu.png";
import { Root } from "react-dom/client";
import { IPokemonStats } from "@utils/requests";

interface ICoordenates {
  x: number;
  y: number;
}

export interface IInputContextMenu {
  show: boolean;
  statsMenu: Root | null;
  data: IPokemonStats;
  coordenates: ICoordenates;
}

export const defaultPokemonStats: IPokemonStats = {
  id: 0,
  hp: 0,
  name: "",
  level: 0,
  power: 0,
  actualHP: 0,
  speed: 0,
  pokemon_id: 0,
  evolution_level: 0,
};

const ContextMenu = ({
  show,
  data,
  coordenates,
  statsMenu,
}: IInputContextMenu): void => {
  if (statsMenu) {
    const dom = show ? (
      <div
        className={
          "w-[100px] h-[117px] text-black absolute text-xs bg-slate-300"
        }
        style={{
          backgroundImage: `url(${background})`,
          top: coordenates.y + 20,
          left: coordenates.x + 20,
        }}
      >
        <ul className="p-0 m-0 mt-1.5 ml-2">
          <li className="leading-4 list-none">ID: {data.pokemon_id}</li>
          <li className="leading-4 list-none">HP: {data.actualHP}</li>
          <li className="leading-4 list-none">Level: {data.level}</li>
          <li className="leading-4 list-none">Speed: {data.speed}</li>
          <li className="leading-4 list-none">Power: {data.power}</li>
          <li className="leading-4 list-none">
            Ev. level: {data.evolution_level}
          </li>
        </ul>
      </div>
    ) : (
      <></>
    );
    statsMenu.render(dom);
  }
};
export default ContextMenu;
