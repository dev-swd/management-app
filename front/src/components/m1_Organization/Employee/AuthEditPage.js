// m1b
import './AuthEditPage.css';
import { useEffect, useState } from 'react';
import { getEmp, updateEmp } from '../../../lib/api/employee';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Button from '@mui/material/Button'
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ModalConfirm from '../../common/ModalConfirm';
import { isEmpty } from '../../../lib/common/isEmpty';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { appAuthorities } from '../../../lib/appAuthority';

const AuthEditPage = (props) => {
  const { empId, closeEdit } = props;
  const [message, setMessage] = useState({ kbn: "", msg: "" });
  const [confirm, setConfirm] = useState({msg: "", tag: ""});
  const [authority, setAuthority] = useState("");
  const [nowAuthority, setNowAuthority] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");

  // システム権限名称取得
  const setAuthorityName = (id) => {
    var auth = appAuthorities.find(e => e.id===id);
    if (isEmpty(auth)) {
      return id;
    } else {
      return auth.name;
    }
  }

  // 初期処理
  useEffect(() => {
    if (!isEmpty(empId)) {
      handleGetEmp();
    }
  }, [empId]);

  // 社員情報取得
  const handleGetEmp = async () => {
    try {
      const res = await getEmp(Number(empId));
      setNumber(res.data.emp.number);
      setName(res.data.emp.name);
      if (!isEmpty(res.data.emp.authority)) {
        setAuthority(res.data.emp.authority);
        setNowAuthority(setAuthorityName(res.data.emp.authority));
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "社員情報取得エラー"});
    }
  }

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (authority === nowAuthority) {
      // 変更されていない場合非活性
      return true;
    } else {
      return false;
    }
  }
  
  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "システム権限を変更します。よろしいですか？",
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
      const res = await updateEmp(empId, {authority: authority});
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
    setAuthority("");
    setNowAuthority("");
    setMessage({kbn: "", msg: ""});
  }

  return (
    <>
      { empId ? (
      <div className="overlay">
        <div className="m1b-containar">
          <div className="m1b-header-area">
            <div className="m1b-header-title">システム権限変更</div>
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

          <div className="m1b-row">
            <div className="m1b-number">{number}</div>
            <div className="m1b-name">{name}</div>
          </div>
          <div className="m1b-row">
            <FormControl variant="standard">
              <InputLabel id="select-authority-label" sx={{fontSize:11, fontFamily:"sans-serif"}}>システム権限</InputLabel>
              <Select
                labelId="select-authority-label"
                id="select-authority"
                name="authority"
                value={authority}
                onChange={(e) => setAuthority(e.target.value)}
                sx={{ fontSize:11, fontFamily:"sans-serif", height:25, width:180 }}
              >
                { appAuthorities.map((a,i) => 
                  <MenuItem sx={{fontSize:11, fontFamily:"sans-serif"}} value={a.id}>{a.name}</MenuItem>
                )}
              </Select>        
            </FormControl>
            <div className="m1b-authority">{"（ 現在の権限： " + nowAuthority + " ）"}</div>
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
export default AuthEditPage;
