import styles from "./login.module.css";
import jwt_decode from "jwt-decode";
import { GlobalContext, IContext } from "@contexts/contexts";
import { useContext, useEffect, useState } from "react";
import { IResponse, requestLogin, requestRegister } from "@utils/requests";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";

const LoginPage = (): JSX.Element => {
  const { dispatch }: IContext = useContext(GlobalContext);
  const [inputUser, setInputUser] = useState<string>("");
  const [inputPass, setInputPass] = useState<string>("");
  const [inputError, setInputError] = useState<string>("");

  useEffect(() => {
    const lStorage: string = localStorage.getItem("UserID")!;
    if (lStorage) {
      customDispatch(dispatch, {
        type: dispatch_types.SET_USER_ID,
        payload: jwt_decode<{ data: number }>(lStorage).data,
      });
    }
  }, [dispatch]);

  const handleLogin = async (): Promise<void> => {
    const res: IResponse = await requestLogin({
      nick: inputUser,
      pass: inputPass,
    });
    if (res.data) {
      localStorage.setItem("UserID", JSON.stringify(res.data));
      const res2: number = jwt_decode<{ data: number }>(res.data).data;
      customDispatch(dispatch, {
        type: dispatch_types.SET_USER_ID,
        payload: res2,
      });
    } else {
      setInputError("Error in loggin");
    }
  };

  const handleRegister = async () => {
    const res: IResponse = await requestRegister({
      nick: inputUser,
      pass: inputPass,
    });
    if (res.data) {
      localStorage.setItem("UserID", JSON.stringify(res.data));
      const res2: number = jwt_decode<{ data: number }>(res.data).data;
      customDispatch(dispatch, {
        type: dispatch_types.SET_USER_ID,
        payload: res2,
      });
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
