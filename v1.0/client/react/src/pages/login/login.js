import { useContext, useState } from "react"
import { ContextUserID } from "../../contexts/contexts"
import { requestLogin, requestRegister } from "../../utils/requests"
import "./login.styles.css"

const LoginPage = ()=>{
    const {setUserID} = useContext(ContextUserID)
    const [inputUser, setInputUser] = useState("")
    const [inputPass, setInputPass] = useState("")
    const [inputError, setInputError] = useState("")
    
    const handleLogin = async ()=>{
        const res = await requestLogin({nick:inputUser, pass:inputPass})
        if(res.data){
            setUserID(res.data)
        } else {
            setInputError("Error in loggin")
        }
    }

    const handleRegister = async ()=>{
        const res = await requestRegister({nick:inputUser, pass:inputPass})
        if(res.data){
            setUserID(res.data)
        } else {
            setInputError("Error in register")
        }
    }

    return (
        <div className={"login-container"}>
            <div className={"login-box"}>
                <div className={"login-inputs"}>
                    <div>
                        <span>User:</span>
                        
                        <input
                        type="text"
                        value={inputUser}
                        onChange={(e)=>setInputUser(e.target.value)}/>
                    </div>
                    <div>
                        <span>Password:</span>
                        <input
                        type="password"
                        value={inputPass}
                        onChange={(e)=>setInputPass(e.target.value)}/>
                    </div>
                    {inputError ? (<span style={{color:"red"}}>{inputError}</span>) : null}
                    
                </div>
                <div className={"login-buttons"}>
                    <button onClick={()=>handleRegister()}>Register</button>
                    <button onClick={()=>handleLogin()}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default LoginPage