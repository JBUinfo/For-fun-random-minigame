import React, { useState } from 'react';
import Modal from './components/modal/modal.component';
import { ContextModal, ContextUserID } from './contexts/contexts';
import HomePage from './pages/home/home';
import LoginPage from './pages/login/login';

function App() {
  const [dataModal, setDataModal] = useState({
    show:false,
    backgroundColor: "white",
    text:"Example test"
  })
  const [userID, setUserID] = useState(null)
  return(
    <>
      <ContextUserID.Provider value={{userID, setUserID}}>
        {userID ? (
          <ContextModal.Provider value={{dataModal,setDataModal}}>
          <HomePage/>
          <Modal/>
        </ContextModal.Provider>
        ) : (
          <LoginPage/>
        )}
        
      </ContextUserID.Provider>
    </>
  );
}

export default App;
