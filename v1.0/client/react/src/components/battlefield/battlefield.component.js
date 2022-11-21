import "./battlefield.styles.css"
import { handleMouseLeaveToContextMenu, handleMouseMoveToContextMenu } from "../../utils/handles"

const Battlefield = ({pokemons, enemy, setContextMenu, handleAttack, handleSwapBattle})=>{

    return pokemons ? (
        <div className={"battleflied-container"}>
            <div className={"battle-container"}>
                <div className={"middle-battle"}>
                    {pokemons.map((e,i)=>{
                        const percentageHP = e.actualHP * 100 / e.hp
                        return(
                        <div onClick={()=>handleSwapBattle(e)}className={"row-in-battle"} key={i}>
                            <div
                            onMouseMove={(event)=>handleMouseMoveToContextMenu(event, e, setContextMenu)}
                            onMouseLeave={()=>handleMouseLeaveToContextMenu(setContextMenu)}
                            className={"container-pokemon-battle"}>
                                <div className={"box-pokemon-battle"}>
                                    <div className={"img-battle-box"}>
                                        <img className={"img-pokemon-battlefield"} alt={e.name} src={`http://localhost:8080/image/${e.pokemon_id}`}/>
                                    </div>
                                </div>
                                <div className={"box-pokemon-battle"}>
                                    <div>{e.name}</div>
                                    <div>HP <div className={"hp-bar"} style={{width:`${percentageHP}%`}}></div></div>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
                <div className="middle-battle">
                    {enemy.map((e,i)=>{
                        const percentageHP = e.actualHP * 100 / e.hp
                        return(
                        <div className={"row-in-battle"} key={i}>
                            <div
                            onMouseMove={(event)=>handleMouseMoveToContextMenu(event, e, setContextMenu)}
                            onMouseLeave={()=>handleMouseLeaveToContextMenu(setContextMenu)}
                            className={"container-pokemon-battle"}>
                                <div className={"box-pokemon-battle"}>
                                    <div>{e.name}</div>
                                    <div>HP <div className={"hp-bar"} style={{width:`${percentageHP}%`}}></div></div>
                                </div>
                                <div className={"box-pokemon-battle"}>
                                    <div className={"img-battle-box"}>
                                        <img className={"img-pokemon-battlefield"} alt={e.name} src={`http://localhost:8080/image/${e.pokemon_id}`}/>
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>  
            </div>
            <div className="buttons-container">
                <button onClick={()=>handleAttack()}className="attack-button"> ATTACK </button>
            </div>
        </div>
    ) : null
}

export default Battlefield