import styles from "./login.module.css";
import { decodeToken, isExpired } from "react-jwt";
import { GlobalContext } from "../../contexts/contexts";
import { useContext, useEffect, useState } from "react";
import { requestLogin, requestRegister } from "../../utils/requests";
import { customDispatch, dispatch_types } from "../../contexts/dispatchs";

const LoginPage = () => {
  const dispatch = useContext(GlobalContext)[1];
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [inputError, setInputError] = useState("");

  useEffect(() => {
    const lStorage = JSON.parse(localStorage.getItem("userID"));
    if (lStorage) {
      if (!isExpired(lStorage)) {
        customDispatch(
          dispatch,
          dispatch_types.SET_USER_ID,
          decodeToken(lStorage).data
        );
      }
    }
  }, [dispatch]);

  const handleLogin = async () => {
    const res = await requestLogin({ nick: inputUser, pass: inputPass });
    if (res.data) {
      localStorage.setItem("userID", JSON.stringify(res.data));
      const res2 = decodeToken(res.data);
      customDispatch(dispatch, dispatch_types.SET_USER_ID, res2.data);
    } else {
      setInputError("Error in loggin");
    }
  };

  const handleRegister = async () => {
    const res = await requestRegister({ nick: inputUser, pass: inputPass });
    if (res.data) {
      localStorage.setItem("userID", JSON.stringify(res.data));
      const res2 = decodeToken(res.data);
      customDispatch(dispatch, dispatch_types.SET_USER_ID, res2.data);
    } else {
      setInputError("Error in register");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-box"]}>
        <div className={styles["login-inputs"]}>
          <div>
            <span>User:</span>
            <input
              type="text"
              value={inputUser}
              onChange={(e) => setInputUser(e.target.value)}
            />
          </div>
          <div>
            <span>Password:</span>
            <input
              type="password"
              value={inputPass}
              onChange={(e) => setInputPass(e.target.value)}
            />
          </div>
          {inputError ? (
            <span style={{ color: "red" }}>{inputError}</span>
          ) : null}
        </div>
        <div className={styles["login-buttons"]}>
          <button onClick={() => handleRegister()}>Register</button>
          <button onClick={() => handleLogin()}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
