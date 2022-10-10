// m21
import './PrjNewPage.css';
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../App";
import { getEmps } from "../../lib/api/employee";
import { createPrj } from "../../lib/api/project";
import { hankakuOnly } from "../../lib/common/InputRegulation";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import DateAdapter from "@mui/lab/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";
import ModalConfirm from '../common/ModalConfirm';
import { isEmpty } from '../../lib/common/isEmpty';

const today = new Date();

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
}
const PrjNewPage = (props) => {
  const { showFlg, closeWindow } = props;
  const { empInfo } = useContext(AuthContext);
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [data, setData] = useState({});  
  const [options, setOptions] = useState([]);
  const [plId, setPlId] = useState({value: "", label: ""});
  const [approval, setApproval] = useState({value: "", label: ""});
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    // 画面初期化
    setData({ number: "", name: "", approval_date: today });
    setPlId({value: "", label: ""});
    setApproval({value: empInfo.id, label: empInfo.name});
    // 社員リスト取得
    handleGetEmps();
  }, [showFlg]);

  // 社員リスト取得
  const handleGetEmps = async () => {
    try {
      const res = await getEmps();
      const tmpOptions = res.data.emps.map(e => {
        const tmpOption = {};
        tmpOption.value = e.id;
        tmpOption.label = e.name;
        return tmpOption;
      });
      setOptions(tmpOptions);
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー（リスト）"});
    }
  }

  // プロジェクトNo,プロジェクト名入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  }

  // 承認日入力時の処理
  const handleChangeAd = (value) => {
    setData({
      ...data,
      approval_date: value,
    });
  }

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (isEmpty(data.number) || isEmpty(data.name) || isEmpty(plId) || isEmpty(data.approval_date) || isEmpty(approval)) {
      return true;
    } else {
      if (isEmpty(plId.value) || isEmpty(approval.value)) {
        return true;
      } else {
        return false;
      }
    }
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "プロジェクト情報を登録します。よろしいですか？",
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
      const res = await createPrj({prj: {number: data.number,
                                    name: data.name,
                                    pl_id: plId.value,
                                    approval_date: data.approval_date,
                                    approval: approval.value,
                                    status: "計画未提出"
                                  }});
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "プロジェクト情報登録エラー(500)"});
      } else {
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "プロジェクト情報登録エラー"});
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
    closeWindow();
    setData({});
    setMessage({kbn: "", msg: ""});
  }

  // 画面編集
  return (
    <>
      { showFlg ? (
      <div className="overlay">
        <div className="m21-container">
          <div className="m21-header-area">
            <div className="m21-header-title">プロジェクト新規登録</div>
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

          {/* プロジェクトNo. */}
          <div className="m21-text-pos">
            <TextField
              id="number"
              name="number"
              label="プロジェクトNo.*"
              value={data.number}
              variant="standard"
              size="small"
              style={{width:100}}
              inputProps={{maxLength:10, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, hankakuOnly(e.target.value))}
            />
          </div>
          {/* プロジェクト名 */}
          <div className="m21-text-pos">
            <TextField
              id="name"
              name="name"
              label="プロジェクト名*"
              value={data.name}
              variant="standard"
              size="small"
              style={{width:300}}
              inputProps={{maxLength:25, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          {/* PL */}
          <div className="m21-text-pos">
            <SelectPl
              plId={plId}
              setPlId={setPlId}
              options={options}
            />
          </div>
          {/* 承認日 */}
          <div className="m21-text-pos">
            <LocalizationProvider dateAdapter={DateAdapter} locale={jaLocale} >
              <DatePicker
                label="承認日*"
                inputFormat="yyyy年MM月dd日"
                mask='____/__/__'
                value={data.approval_date}
                onChange={handleChangeAd}
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
          {/* 承認者 */}
          <div className="m21-text-pos">
            <SelectApproval
              approval={approval}
              setApproval={setApproval}
              options={options}
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
export default PrjNewPage;

// PLリストボックス
const SelectPl = (props) => {
  const { plId, setPlId, options } = props;

  return (
    <Autocomplete
      id="pl_id"
      name="pl_id"
      size="small" 
      style={{width:150}}
      options={options}
      noOptionsText={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"該当なし"}</Typography>}
      renderOption={(props, option) => (
        <Box style={{fontSize: 11}} {...props}>
            {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField 
          {...params}
          label="PL*"
          variant="standard"
          InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}  
          inputProps={{ ...params.inputProps, style: {fontSize:11, fontFamily:"sans-serif"}}}
        />
      )}
      value={plId}
      onChange={(_event,newTerm) => {
        setPlId(newTerm);
      }}
    />
  )
}

// 承認者リストボックス
const SelectApproval = (props) => {
  const { approval, setApproval, options } = props;

  return (
    <Autocomplete
      id="approval"
      name="approval"
      size="small" 
      style={{width:150}}
      options={options}
      noOptionsText={<Typography sx={{fontSize: 11, fontFamily:"sans-serif"}}>{"該当なし"}</Typography>}
      renderOption={(props, option) => (
        <Box style={{fontSize: 11}} {...props}>
            {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField 
          {...params}
          label="承認者*"
          variant="standard"
          InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}  
          inputProps={{ ...params.inputProps, style: {fontSize:11, fontFamily:"sans-serif"}}}
        />
      )}
      value={approval}
      onChange={(_event,newTerm) => {
        setApproval(newTerm);
      }}
    />
  )
}