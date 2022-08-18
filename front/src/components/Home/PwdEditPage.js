// m03
import './PwdEditPage.css';
import { useState, useContext } from "react";
import { AuthContext } from "../../App";
import { updatePassword } from '../../lib/api/employee';
import { signIn } from "../../lib/api/auth";
import Cookies from "js-cookie";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import ModalConfirm from '../common/ModalConfirm';

const initDevise = { password: "", passwordConfirmation: "", currentPassword: "" };

const PwdEditPage = (props) => {
  const { showFlg, closeEdit, empInfo, currentUser } = props;
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [devise, setDevise] = useState(initDevise);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // Devise情報入力時の処理
  const handleChangeDevise = (name, value) => {
    if (name==="name") {
      setDevise({
        ...devise,
        name: value,
        email: value + "@example.com",
      });
    } else {
      setDevise({
        ...devise,
        [name]: value,
      });
    }
  }

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (devise.password === "" || devise.passwordConfirmation ==="" || devise.currentPassword === "" ) {
      return true;
    } else {
      return false;
    }
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "パスワードを変更します。よろしいですか？",
      tag: "",
    });
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = async (dummy) => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
    try {
      // Deviseパスワード変更
      const res = await updatePassword(empInfo.id, up_params);
      if (res.status === 200) {
        // パスワード変更成功の場合、サインアウトされているので、サインインする。
        try {
          const res2 =await signIn(in_params);
          if (res2.status === 200) {
            // ログインに成功した場合はCookieに各値を格納
            Cookies.set("_access_token", res2.headers["access-token"]);
            Cookies.set("_client", res2.headers["client"])
            Cookies.set("_uid", res2.headers["uid"])
            
            setIsSignedIn(true);
            setCurrentUser(res2.data.data);

            handleClose();
          } else {
            setMessage({kbn: "error", msg: "再サインインに失敗しました(" + res2.status + ")"});
          }
        } catch (err) {
          setMessage({kbn: "error", msg: "再サインインに失敗しました"});
        }

      } else {
        setMessage({kbn: "error", msg: "パスワード変更エラー(" + res.status + ")"});
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "パスワード変更エラー"});
    }
  }

  // devise SignUpパラメータ
  const up_params = {
    password: devise.password,
    password_confirmation: devise.passwordConfirmation,
    current_password: devise.currentPassword
  }

  // devise SignInパラメータ
  const in_params = {
    name: currentUser.name,
    password: devise.password
  }

  // 確認ダイアログでキャンセルの場合の処理
  const handleCofirmCancel = () => {
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
  }

  // 画面終了時の処理
  const handleClose = () => {
    closeEdit();
    setDevise(initDevise);
    setMessage({kbn: "", msg: ""});
  }

  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="m03-containar">
          <div className="m03-header-area">
            <div className="m03-header-title">パスワード変更</div>
            <IconButton color="primary" aria-label="Close" size="large" onClick={(e) => handleClose()}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
          { message.kbn && <Alert severity={message.kbn}>{message.msg}</Alert>}
        
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveAltIcon />}
            disabled={setDisabledSubmit()}
            onClick={() => handleSubmit()}
            style={{marginTop:20, marginLeft:20}}
          >
            変更
          </Button>
        
          {/* SignUp */}
          <div className="m03-text-pos">
            <TextField 
              type="password" 
              id="password"
              name="password"
              label="New Password*" 
              value={devise.password}
              variant="standard"
              size="small"
              style={{width:200}}
              inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChangeDevise(e.target.name, e.target.value)}
            />
          </div>
          <div className="m03-text-pos">
            <TextField 
              type="password" 
              id="passwordConfirmation"
              name="passwordConfirmation"
              label="New Password Confirmation*" 
              value={devise.passwordConfirmation}
              variant="standard"
              size="small"
              style={{width:200}}
              inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChangeDevise(e.target.name, e.target.value)}
            />
          </div>
          <div className="m03-text-pos">
            <TextField 
              type="password" 
              id="currentPassword"
              name="currentPassword"
              label="Old Password*" 
              value={devise.currentPassword}
              variant="standard"
              size="small"
              style={{width:200}}
              inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChangeDevise(e.target.name, e.target.value)}
            />
          </div>
        </div>
        <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
      </div>
      ) : (
        <></>
      )}
    </>
  )
}
export default PwdEditPage;
