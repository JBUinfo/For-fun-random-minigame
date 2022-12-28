import jwt_decode from "jwt-decode";
import { GlobalContext, IContext } from "@contexts/contexts";
import { useContext, useEffect, useState } from "react";
import { IResponse, requestLogin, requestRegister } from "@utils/requests";
import { customDispatch, dispatch_types } from "@contexts/dispatchs";

interface IUserDB {
  id: number;
  nick: string;
  pass: string;
  plays: number;
}

interface IOBjectJWT {
  iat: number;
  userDB: IUserDB;
}

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
        payload: jwt_decode<IOBjectJWT>(lStorage).userDB.id,
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
      const res2: number = jwt_decode<IOBjectJWT>(res.data).userDB.id;
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
      const res2: number = jwt_decode<IOBjectJWT>(res.data).userDB.id;
      customDispatch(dispatch, {
        type: dispatch_types.SET_USER_ID,
        payload: res2,
      });
    } else {
      setInputError("Error in register");
    }
  };

  return (
    <div
      className={
        "flex justify-center items-center w-screen h-screen bg-green-500"
      }
    >
      <div className={"flex flex-col p-2.5 rounded-lg bg-green-700"}>
        <div className={"p-2.5"}>
          <div className="m-2 text-white">
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
        <div className={"flex flex-row content-between"}>
          <button className="p-2" onClick={() => handleRegister()}>
            Register
          </button>
          <button className="p-2" onClick={() => handleLogin()}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
