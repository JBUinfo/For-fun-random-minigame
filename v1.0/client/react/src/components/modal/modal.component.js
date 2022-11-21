import "./modal.styles.css"
import { useContext } from "react"
import { ContextModal } from "../../contexts/contexts"

const Modal = ()=>{
    const {dataModal, setDataModal} = useContext(ContextModal)
    const handleClickCloseModal = ()=>{
        setDataModal({show:false})
    }
    const selectColor = ()=>{
        switch(dataModal.backgroundColor){
            case "red": return "rgb(187 247 208);"
            case "green": return "rgb(187 247 208);"
            default: return "rgb(240 253 244);"
        }
    }
    return dataModal.show ? (
        <div style={{backgroundColor:selectColor}} className={"modal-container"}>
            <div className={"center-box-modal"}>
                <div className={"text-box-modal"}>
                    <div style={{width:"80%"}}>
                        {dataModal.text}
                    </div>                    
                </div>
                <div className={"button-box-modal"}>
                    <button onClick={(e)=>handleClickCloseModal()} className={"modal-button"}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    ): null
}

export default Modal