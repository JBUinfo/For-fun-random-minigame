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
  velocity: 0,
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
        className={styles["contextMenu-container"]}
        style={{
          backgroundImage: `url(${background})`,
          top: coordenates.y + 20,
          left: coordenates.x + 20,
        }}
      >
        <ul>
          <li>ID: {data.pokemon_id}</li>
          <li>HP: {data.actualHP}</li>
          <li>Level: {data.level}</li>
          <li>Speed: {data.velocity}</li>
          <li>Power: {data.power}</li>
          <li>Ev. level: {data.evolution_level}</li>
        </ul>
      </div>
    ) : (
      <></>
    );
    statsMenu.render(dom);
  }
};
export default ContextMenu;
