import "./SignInPage.css";
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { AuthContext } from "../../App";
import { signIn } from "../../lib/api/auth";
import { getEmpDevise } from "../../lib/api/employee";
import { TextField, Button, Alert } from "@mui/material";
import { setAuhority } from "../../lib/appAuthority";

const SignInPage = () => {
  const { setIsSignedIn, setCurrentUser, setEmpInfo, setAuthInfo } = useContext(AuthContext)
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = {
      name: name,
      password: password
    }

    try {
      const res = await signIn(params);
      if (res.status === 200) {
        // ログインに成功した場合はCookieに各値を格納
        Cookies.set("_access_token", res.headers["access-token"]);
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])
        
        setIsSignedIn(true);
        setCurrentUser(res.data.data);

        // 社員情報取得
        try {
          const res2 = await getEmpDevise(Number(res.data.data.id));
          if (res2.data.status === 500) {
            navigate(`/empinit`);
          } else {
            setEmpInfo(res2.data.emp);
            // 権限情報設定
            setAuthInfo(setAuhority(res2.data.emp.authority));

            navigate(`/`);
            console.log("Signed in successfully!")
          }
        } catch (e) {
          setMessage("社員情報取得エラー");
          setMessageVar("error");
        }    
      } else {
        setMessage("Invalid username or password");
        setMessageVar("error");
      }
    } catch (err) {
      console.log(err);
      setMessage("Invalid username or password");
      setMessageVar("error");
    }
  }

  return (
    <div className="background">
      <div className="signin-container">
        <div className="header-title">Sign In</div>
        { message_var && <Alert severity={message_var}>{message}</Alert>}
        <div className="content">
          <TextField 
            variant="outlined" 
            required 
            fullWidth
            size="small"
            label="UserName" 
            value={name} 
            margin="dense" 
            onChange={event => setName(event.target.value)} 
          />
        </div>
        <div className="content">
          <TextField 
            variant="outlined" 
            required 
            fullWidth
            size="small"
            label="Password" 
            type="password" 
            value={password} 
            margin="dense" 
            autocomplate="current-password" 
            onChange={event => setPassword(event.target.value)} 
          />
        </div>
        <div className="content">
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            color="primary" 
            disabled={!name || !password ? true : false}
            onClick={(e) => handleSubmit(e)}
          >
            submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
