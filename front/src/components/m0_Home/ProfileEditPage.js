// m04
import './ProfileEditPage.css';
import { useEffect, useState } from 'react';
import { getEmp, updateEmp } from '../../lib/api/employee';
import { integerOnly, phoneOnly } from '../../lib/common/InputRegulation';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import DateAdapter from "@mui/lab/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";
//import AdapterDateFns from '@mui/lab/AdapterDateFns';
//import ja from 'date-fns/locale/ja'
import ModalConfirm from '../common/ModalConfirm';

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
  },
  // モバイル用は使用しないが備忘録として残す
  mobiledialogprops: {
    '.PrivatePickersToolbar-dateTitleContainer .MuiTypography-root': {
      fontSize: '1.5rem' // 選択した日付のフォントサイズを変更
    },
    'div[role=presentation]:first-of-type': {
      display: 'flex',
      '& .PrivatePickersFadeTransitionGroup-root:first-of-type': {
        order: 2
      },
      '& .PrivatePickersFadeTransitionGroup-root:nth-of-type(2)': {
        order: 1,
        '& > div::after': {
          content: '"年"'
        },
      },
      
      '& .MuiButtonBase-root': {
        order: 3
      }
    },
  }
}

const ProfileEditPage = (props) => {
  const { showFlg, closeEdit, empInfo } = props;
  const [data, setData] = useState({});
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    handleGetEmp();
  }, [showFlg]);

  // 社員情報取得
  const handleGetEmp = async () => {
    try {
      const res = await getEmp(Number(empInfo.id));
      setData(res.data.emp);
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー"});
    }
  }

  // 画面入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value
    });
  }

  // 画面入力時（誕生日）の処理
  const handleChangeBd = (value) => {
    setData({
      ...data,
      birthday: value
    });
  }

  // 画面入力時（入社日）の処理
  const handleChangeJd = (value) => {
    setData({
      ...data,
      joining_date: value
    });
  }

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (data.number === "" || data.name === "" ) {
      return true;
    } else {
      return false;
    }
  }
  
  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "プロフィールを変更します。よろしいですか？",
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
      const res = await updateEmp(empInfo.id, data);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "社員情報登録エラー(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報登録エラー"});
    }
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
    setData({});
    setMessage({kbn: "", msg: ""});
  }

  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="m04-containar">
          <div className="m04-header-area">
            <div className="m04-header-title">プロフィール変更</div>
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

          <div className="m04-text-pos">
            <TextField
              id="number"
              name="number"
              label="社員番号*"
              value={data.number}
              variant="standard"
              size="small"
              style={{width:50}}
              inputProps={{maxLength:3, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, integerOnly(e.target.value))}
            />
          </div>
          <div className="m04-text-pos">
            <TextField
              id="name"
              name="name"
              label="氏名（漢字）*"
              value={data.name}
              variant="standard"
              size="small"
              style={{width:200}}
              inputProps={{maxLength:10, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="m04-text-pos">
            <TextField
              id="name2"
              name="name2"
              label="氏名（カナ）"
              value={data.name2}
              variant="standard"
              size="small"
              style={{width:200}}
              inputProps={{maxLength:10, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="m04-text-pos">
            <TextField
              id="address"
              name="address"
              label="住所"
              value={data.address}
              variant="standard"
              size="small"
              style={{width:400}}
              inputProps={{maxLength:40, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <div className="m04-text-pos">
            <TextField
              id="phone"
              name="phone"
              label="電話番号"
              value={data.phone}
              variant="standard"
              size="small"
              style={{width:150}}
              inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, phoneOnly(e.target.value))}
            />
          </div>
          <div className="m04-text-pos">
            {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} dateFormats={{ monthAndYear: 'yyyy年MM月' }} > */}
            <LocalizationProvider dateAdapter={DateAdapter} locale={jaLocale} >
              <DatePicker
                label="生年月日"
                inputFormat="yyyy年MM月dd日"
                mask='____/__/__'
                value={data.birthday}
                onChange={handleChangeBd}
                inputProps={{style: {fontSize:11, fontFamily:"sans-serif"} }}
                renderInput={(params) => <TextField 
                                          {...params} 
                                          variant="standard" 
                                          size="small" 
                                          InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }} 
                                        />}
                PaperProps={{ sx: styles.paperprops }}
              />
            </LocalizationProvider>
          </div>
          <div className="m04-text-pos">
            {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja} > */}
            <LocalizationProvider dateAdapter={DateAdapter} locale={jaLocale} >
              <DatePicker
                label="入社年月日"
                inputFormat="yyyy年MM月dd日"
                mask='____/__/__'
                variant="standard"
                size="small"
                value={data.joining_date}
                onChange={handleChangeJd}
                inputProps={{style: {fontSize:11, fontFamily:"sans-serif"} }}
                renderInput={(params) => <TextField 
                                          {...params} 
                                          variant="standard" 
                                          size="small" 
                                          InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }} 
                                        />}
                PaperProps={{ sx: styles.paperprops }}
              />
            </LocalizationProvider>
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
export default ProfileEditPage;
