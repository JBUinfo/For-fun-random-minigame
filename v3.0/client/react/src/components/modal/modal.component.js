import { useContext } from "react";
import { GlobalContext } from "../../contexts/contexts";
import { customDispatch, dispatch_types } from "../../contexts/dispatchs";
import styles from "./modal.module.css";

const selectColor = (backgroundColor) => {
  switch (backgroundColor) {
    case "red":
      return "rgb(187 247 208);";
    case "green":
      return "rgb(187 247 208);";
    default:
      return "rgb(240 253 244);";
  }
};
const onClose = (dispatch) => {
  customDispatch(dispatch, dispatch_types.CLOSE_MODAL);
};

const Modal = () => {
  const [state, dispatch] = useContext(GlobalContext);
  return state.dataModal.show ? (
    <div
      style={{ backgroundColor: selectColor(state.dataModal.backgroundColor) }}
      className={styles["modal-container"]}
    >
      <div className={styles["center-box-modal"]}>
        <div className={styles["text-box-modal"]}>
          <div style={{ width: "80%" }}>{state.dataModal.text}</div>
        </div>
        <div className={styles["button-box-modal"]}>
          <button
            onClick={() => onClose(dispatch)}
            className={styles["modal-button"]}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
export default Modal;
