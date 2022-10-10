// m15
import './EmpNewPage.css';
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import DateAdapter from "@mui/lab/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";
import ModalConfirm from '../../common/ModalConfirm';
import { hankakuOnly, integerOnly } from '../../../lib/common/InputRegulation';
import { signUp } from "../../../lib/api/auth";
import { createEmp, updateEmp, deleteEmp } from '../../../lib/api/employee';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { appAuthorities } from '../../../lib/appAuthority';


const initDevise = { name: "", email: "", password: "", passwordConfirmation: "" };
const initEmp = { number: "", name: "", joining_date: "", authority: appAuthorities[0].id };

// DatePickerのためのStyle
const styles = {
  paperprops: {
    'div[role=presentation]': {
      display: 'flex',
      '& .PrivatePickersFadeTransitionGroup-root:first-of-type': {
        order: 2
      },
      '& .PrivatePickersFadeTransitionGroup-root:nth-of-type(2)': {
        order: 1,
        '& div::after':{
          content: '"年"'
        }
      },
      '& .MuiButtonBase-root': {
        order: 3
      }
    }
  }
}

const EmpNewPage = (props) => {
  const { showFlg, closeNewEmp } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [devise, setDevise] = useState(initDevise);
  const [emp, setEmp] = useState(initEmp);
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

  // 社員情報入力時の処理
  const handleChangeEmp = (name, value) => {
    setEmp({
      ...emp,
      [name]: value,
    });
  }

  // 社員情報入力時（入社日）の処理
  const handleChangeJd = (value) => {
    setEmp({
      ...emp,
      joining_date: value
    });
  }

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (devise.name === "" || devise.password === "" || devise.passwordConfirmation ==="" || emp.number === "" || emp.name ==="") {
      return true;
    } else {
      return false;
    }
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "社員情報を登録します。よろしいですか？",
      tag: "",
    });
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = async (dummy) => {
    let res3;
    setConfirm({
      ...confirm,
      msg: "",
      tag: "",
    });
    try {
      const res = await createEmp({number: emp.number, name: emp.name, joining_date: emp.joining_date, authority: emp.authority});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "社員情報登録エラー(500)"});
      } else {
        // 社員登録が正常だった場合
        try {
          // Devise SignUp
          const res2 = await signUp(up_params);
          if (res2.status === 200) {
            // 正常にSignUpできた場合、社員情報更新
            try {
              res3 = await updateEmp(Number(res.data.emp.id), { devise_id: res2.data.data.id })
              if (res3.data.status === 500) {
                setMessage({kbn: "error", msg: "社員情報更新エラー(500)"});
              } else {
                handleClose();
              }
            } catch (e) {
              setMessage({kbn: "error", msg: "社員情報更新エラー"});
            }
          } else {
            setMessage({kbn: "error", msg: "ログインユーザ登録エラー(500)"});
            // 社員情報削除
            res3 = await deleteEmp(Number(res.data.emp.id));
          }
        } catch (e) {
          setMessage({kbn: "error", msg: "ログインユーザ登録エラー"});
          // 社員情報削除
          res3 = await deleteEmp(Number(res.data.emp.id));
        }
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報登録エラー"});
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
    closeNewEmp();
    setDevise(initDevise);
    setEmp(initEmp);
    setMessage({kbn: "", msg: ""});
  }
  

  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="m15-emp-new-container">
          <div className="m15-header-area">
            <div className="m15-header-title">社員追加</div>
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

          {/* SignUp */}
          <div className="m15-devise-area">
            <div className="m15-area-title">■ログイン情報</div>
            <div className="m15-text-pos">
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
            <div className="m15-text-pos">
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
            <div className="m15-text-pos">
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

          {/* Employee */}
          <div className="m15-emp-area">
            <div className="m15-area-title">■社員情報</div>
            <div className="m15-text-pos">
              <TextField
                id="emp-number"
                name="number"
                label="社員番号*"
                value={emp.number}
                variant="standard"
                size="small"
                style={{width:50}}
                inputProps={{maxLength:3, style: {fontSize:11, fontFamily:"sans-serif"} }}
                InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
                onChange={(e) => handleChangeEmp(e.target.name, integerOnly(e.target.value))}
              />
            </div>
            <div className="m15-text-pos">
              <TextField
                id="emp-name"
                name="name"
                label="氏名（漢字）*"
                value={emp.name}
                variant="standard"
                size="small"
                style={{width:200}}
                inputProps={{maxLength:10, style: {fontSize:11, fontFamily:"sans-serif"} }}
                InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
                onChange={(e) => handleChangeEmp(e.target.name, e.target.value)}
              />
            </div>
            <div className="m15-text-pos">
              <LocalizationProvider dateAdapter={DateAdapter} locale={jaLocale} >
                <DatePicker
                  label="入社年月日"
                  inputFormat="yyyy年MM月dd日"
                  mask='____/__/__'
                  variant="standard"
                  size="small"
                  value={emp.joining_date}
                  onChange={handleChangeJd}
                  inputProps={{style: {fontSize:11, fontFamily:"sans-serif"} }}
                  renderInput={(params) => <TextField 
                                            {...params}
                                            error={false} 
                                            variant="standard" 
                                            size="small" 
                                            InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }} 
                                          />}
                  PaperProps={{ sx: styles.paperprops }}
                />
              </LocalizationProvider>
            </div>
            <div className="m15-text-pos">
              <FormControl variant="standard">
                <InputLabel id="select-authority-label" sx={{fontSize:11, fontFamily:"sans-serif"}}>システム権限</InputLabel>
                <Select
                  labelId="select-authority-label"
                  id="select-authority"
                  name="authority"
                  value={emp.authority}
                  onChange={(e) => handleChangeEmp(e.target.name, e.target.value)}
                  sx={{ fontSize:11, fontFamily:"sans-serif", height:25, width:180 }}
                >
                  { appAuthorities.map((a,i) => 
                    <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value={a.id}>{a.name}</MenuItem>
                  )}
                </Select>        
              </FormControl>
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
export default EmpNewPage;
