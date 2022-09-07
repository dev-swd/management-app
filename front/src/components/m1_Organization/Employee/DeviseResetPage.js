// m1a
import { useEffect, useState } from "react";
import './DeviseResetPage.css';
import { signUp } from "../../../lib/api/auth";
import { getEmpWithDevise, updateEmp } from '../../../lib/api/employee';
import { hankakuOnly } from '../../../lib/common/InputRegulation';
import { isEmpty } from '../../../lib/common/isEmpty';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import ModalConfirm from '../../common/ModalConfirm';

const initDevise = { name: "", email: "", password: "", passwordConfirmation: "" };

const DeviseResetPage = (props) => {
  const { empId, closeReset } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [emp, setEmp] = useState({});
  const [devise, setDevise] = useState(initDevise);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(empId)) {
      handleGetEmp(empId);
    }
  }, [empId]);

  // 社員情報取得
  const handleGetEmp = async (id) => {
    try {
      const res = await getEmpWithDevise(Number(id));
      setEmp(res.data.emp);
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー"});
    }
  }

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
    if (devise.name === "" || devise.password === "" || devise.passwordConfirmation ==="" ) {
      return true;
    } else {
      return false;
    }
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "新しいログイン情報に書き換えます。よろしいですか？",
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
      // Devise SignUp
      const res = await signUp(up_params);
      if (res.status === 200) {
        // 正常にSignUpできた場合、社員情報登録
        try {
          const res2 = await updateEmp(empId, {devise_id: res.data.data.id});
          if (res2.data.status === 500) {
            setMessage({kbn: "error", msg: "社員情報更新エラー(500)"});
          } else {
            handleClose();
          }
        } catch (e) {
          setMessage({kbn: "error", msg: "社員情報更新エラー"});
        }
      } else {
        setMessage({kbn: "error", msg: "ログインユーザ登録エラー(UserName重複の可能性があります)"});
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "ログインユーザ登録エラー"});
    }
  }

  // devise SignUpパラメータ
  const up_params = {
    name: devise.name,
    email: devise.email,
    password: devise.password,
    passwordConfirmation: devise.passwordConfirmation
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
    closeReset();
    setDevise(initDevise);
    setEmp({});
    setMessage({kbn: "", msg: ""});
  }

  // 画面編集
  return (
    <>
      { empId ? (
        <div className="overlay">
          <div className="m1a-container">
            <div className="m1a-header-area">
              <div className="m1a-header-title">ログインユーザリセット</div>
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
              登録
            </Button>

            {/* 社員情報 */}
            <div className="m1a-emp-area">
              <div className="m1a-area-title">■社員情報</div>
              <div className="m1a-grid-box">
                <div>社員番号</div>
                <div>{emp.number}</div>
                <div>氏名</div>
                <div>{emp.name}</div>
                <div>UserName</div>
                <div>{emp.devise_name}</div>
              </div>
            </div>

            {/* SignUp */}
            <div className="m1a-devise-area">
              <div className="m1a-area-title">■新しいログイン情報</div>
                <div className="m1a-text-pos">
                <TextField
                  id="signup-name"
                  name="name"
                  label="UserName*"
                  value={devise.name}
                  variant="standard"
                  size="small"
                  style={{width:150}}
                  inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
                  InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
                  onChange={(e) => handleChangeDevise(e.target.name, hankakuOnly(e.target.value))}
                />
              </div>
              <div className="m1a-text-pos">
                <TextField 
                  type="password" 
                  id="signup-password"
                  name="password"
                  label="Password*" 
                  value={devise.password}
                  variant="standard"
                  size="small"
                  style={{width:200}}
                  inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
                  InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
                  onChange={(e) => handleChangeDevise(e.target.name, e.target.value)}
                />
              </div>
              <div className="m1a-text-pos">
                <TextField 
                  type="password" 
                  id="signup-passwordConfirmation"
                  name="passwordConfirmation"
                  label="Password Confirmation*" 
                  value={devise.passwordConfirmation}
                  variant="standard"
                  size="small"
                  style={{width:200}}
                  inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
                  InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
                  onChange={(e) => handleChangeDevise(e.target.name, e.target.value)}
                />
              </div>
            </div>
            
          </div>
          <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />

        </div>
      ) : (
        <></>
      )}
    </>
  );

}
export default DeviseResetPage;
