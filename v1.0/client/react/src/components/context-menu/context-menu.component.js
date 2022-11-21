import "./context-menu.styles.css"
import background from "../../assets/context_menu.png"
const ContextMenu = ({contextMenu})=>{
    return contextMenu.show ? (
        <div className={"contextMenu-container"}
        style={{backgroundImage: `url(${background})`,
        top:contextMenu.coordenates.y+20,
        left:contextMenu.coordenates.x+20}}>
            <ul>
                <li>
                    ID: {contextMenu.data.pokemon_id}
                </li>
                <li>
                    HP: {contextMenu.data.actualHP}
                </li>
                <li>
                    Level: {contextMenu.data.level}
                </li>
                <li>
                    Speed: {contextMenu.data.velocity}
                </li>
                <li>
                    Power: {contextMenu.data.power}
                </li>
                <li>
                    Ev. level: {contextMenu.data.evolution_level}
                </li>
            </ul>
            
        </div>
    ) : null
}

export default ContextMenu