import styles from "./context-menu.module.css";
import background from "../../assets/context_menu.png";

const ContextMenu = ({ show, data, coordenates, statsMenu }) => {
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
};
export default ContextMenu;
