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
    <div
      className={
        "flex justify-center items-center justify-center text-black absolute z-10 w-screen h-screen top-0 left-0"
      }
    >
      <div
        style={{
          backgroundColor: selectColor(state.dataModal.backgroundColor),
        }}
        className={
          "absolute w-[40vw] h-52 bg-green-300 rounded-lg overflow-hidden"
        }
      >
        <div
          className={
            "flex justify-center items-center border-b text-center h-4/5"
          }
        >
          <div style={{ width: "80%" }}>{state.dataModal.text}</div>
        </div>
        <div className={"text-end h-1/5 bg-lime-300"}>
          <button
            onClick={() => onClose(dispatch)}
            className={"border-0 rounded-none w-24 h-full bg-red-600"}
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
