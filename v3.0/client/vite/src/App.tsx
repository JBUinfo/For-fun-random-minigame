import React, { useEffect, useReducer } from "react";
import HomePage from "@pages/home/home";
import LoginPage from "@pages/login/login";
import Modal from "@components/modal/modal.component";
import {
  GlobalContext,
  initialState,
  IInitialState,
  reducer,
  IAction,
} from "./contexts/contexts";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";
import { createRoot } from "react-dom/client";

function App(): JSX.Element {
  const [state, dispatch]: Array<IInitialState | React.Dispatch<IAction>> =
    useReducer(reducer, initialState);
  useEffect(() => {
    if (state.UserID != -1) {
      customDispatch(dispatch, {
        type: dispatch_types.SET_STATS_MENU,
        payload: createRoot(document.getElementById("statsMenu")!),
      });
    }
  }, []);
  return (
    <>
      <GlobalContext.Provider value={{ state, dispatch }}>
        {state.UserID !== -1 ? (
          <>
            <Modal />
            <HomePage />
          </>
        ) : (
          <LoginPage />
        )}
      </GlobalContext.Provider>
    </>
  );
}

export default App;
