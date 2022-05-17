import "./SignUpPage.css";
import { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { AuthContext } from "../../App";
import { signIn, signUp } from "../../lib/api/auth";
import { TextField, Button, Alert } from "@mui/material";

const SignUpPage = () => {
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [message_var, setMessageVar] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const up_params = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation
    }

    const in_params = {
      name: name,
      password: password
    }

    try {
      const res = await signUp(up_params);
      if (res.status === 200) {

        // アカウント作成と同時にログイン
        try {
          const res2 =await signIn(in_params);
          if (res.status === 200) {
            // ログインに成功した場合はCookieに各値を格納
            Cookies.set("_access_token", res.headers["access-token"]);
            Cookies.set("_client", res.headers["client"])
            Cookies.set("_uid", res.headers["uid"])
            
            setIsSignedIn(true);
            setCurrentUser(res.data.data);

            navigate(`/empinit`);
            console.log("Signed in successfully!")
          } else {
            setMessage("Invalid username or password");
            setMessageVar("error");    
          }
        } catch (err) {
          console.log(err);
          setMessage("Invalid username or password");
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
      <div className="signup-container">
        <div className="header-title">Sign Up</div>
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
            label="e-mail" 
            value={email} 
            margin="dense" 
            onChange={event => setEmail(event.target.value)} 
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
          <TextField 
            variant="outlined" 
            required 
            fullWidth
            size="small"
            label="Password Confirmation" 
            type="password" 
            value={passwordConfirmation} 
            margin="dense" 
            autocomplate="current-password" 
            onChange={event => setPasswordConfirmation(event.target.value)} 
          />
        </div>
        <div className="content">
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            fullWidth
            color="primary" 
            disabled={!name || !email || !password || !passwordConfirmation ? true : false}
            onClick={(e) => handleSubmit(e)}
          >
            submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;