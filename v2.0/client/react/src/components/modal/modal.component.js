import styles from "./modal.module.css";
import { useContext } from "react";
import { ContextModal } from "../../contexts/contexts";

const Modal = () => {
  const { dataModal, setDataModal } = useContext(ContextModal);
  const handleClickCloseModal = () => {
    setDataModal({ show: false });
  };
  const selectColor = () => {
    switch (dataModal.backgroundColor) {
      case "red":
        return "rgb(187 247 208);";
      case "green":
        return "rgb(187 247 208);";
      default:
        return "rgb(240 253 244);";
    }
  };
  return dataModal.show ? (
    <div
      style={{ backgroundColor: selectColor }}
      className={styles["modal-container"]}
    >
      <div className={styles["center-box-modal"]}>
        <div className={styles["text-box-modal"]}>
          <div style={{ width: "80%" }}>{dataModal.text}</div>
        </div>
        <div className={styles["button-box-modal"]}>
          <button
            onClick={() => handleClickCloseModal()}
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
