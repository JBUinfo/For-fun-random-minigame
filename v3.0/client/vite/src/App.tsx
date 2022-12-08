import React, { useReducer } from "react";
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

function App(): JSX.Element {
  const [state, dispatch]: Array<IInitialState | React.Dispatch<IAction>> =
    useReducer(reducer, initialState);
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
