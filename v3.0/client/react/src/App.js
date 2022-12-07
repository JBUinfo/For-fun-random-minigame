import React, { useReducer } from "react";
import HomePage from "./pages/home/home";
import LoginPage from "./pages/login/login";
import Modal from "./components/modal/modal.component";
import { GlobalContext, initialState, reducer } from "./contexts/contexts";

function App() {
  const value = useReducer(reducer, initialState);
  const state = value[0];
  return (
    <>
      {state.UserID ? (
        <GlobalContext.Provider value={value}>
          <Modal />
          <HomePage />
        </GlobalContext.Provider>
      ) : (
        <GlobalContext.Provider value={value}>
          <LoginPage />
        </GlobalContext.Provider>
      )}
    </>
  );
}

export default App;
