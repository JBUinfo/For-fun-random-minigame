import React, { useContext } from "react";
import { GlobalContext, IAction, IContext } from "@contexts/contexts";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import styles from "./modal.module.css";

export interface IDataModal {
  text: string;
  show: boolean;
  backgroundColor: string;
}

const selectColor = (backgroundColor: string): string => {
  switch (backgroundColor) {
    case "red":
      return "rgb(187 247 208)";
    case "green":
      return "rgb(187 247 208)";
    default:
      return "rgb(240 253 244)";
  }
};
const onClose = (dispatch: React.Dispatch<IAction>): void => {
  customDispatch(dispatch, { type: dispatch_types.CLOSE_MODAL, payload: null });
};

const Modal = (): JSX.Element => {
  const { state, dispatch }: IContext = useContext(GlobalContext);
  return state.dataModal.show ? (
    <div className={styles["modal-container"]}>
      <div
        style={{
          backgroundColor: selectColor(state.dataModal.backgroundColor),
        }}
        className={styles["center-box-modal"]}
      >
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
  ) : (
    <></>
  );
};
export default Modal;
