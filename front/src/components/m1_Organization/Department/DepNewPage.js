// m11
import './DepNewPage.css';
import { useState } from 'react';
import{ createDep } from '../../../lib/api/department';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import ModalConfirm from '../../common/ModalConfirm';
import { integerOnly } from '../../../lib/common/InputRegulation';

const initData = {code: "", name: ""}

const DepNewPage = (props) => {
  const { showFlg, closeNewDep, setMessage, refresh } = props;
  const [data, setData] = useState(initData);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 画面入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  }

  // 登録ボタン非活性制御
  const setDisabledSubmit = () => {
    if (data.code==="" || data.name==="") {
      return true;
    } else {
      return false;
    }
  }

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "事業部を登録します。よろしいですか？",
      tag: "",
    });
  }

  // 確認ダイアログでOKの場合の処理
  const handleConfirmOK = async (dumy) => {
    try {
      setConfirm({
        ...confirm,
        msg: "",
        tag: "",
      });
      const res = await createDep(data)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "事業部情報登録エラー(500)"});
      } else {
        refresh();
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "事業部情報登録エラー"});
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
    closeNewDep();
    setData({...initData});
    setMessage({kbn: "", msg: ""});
  }

  // 画面表示
  return (
    <>
      { showFlg ? (
        <div className="m11-dep-new-container">
          <div className="m11-header-area">
            <div className="m11-header-title">事業部追加</div>
            <button 
              className="link-style-btn m11-link-close" 
              type="button" 
              onClick={() => handleClose()}>
              {"[閉じる]"}
            </button>
          </div>
          
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveAltIcon />}
            disabled={setDisabledSubmit()}
            onClick={() => handleSubmit()}
            style={{marginTop:20, marginBottom:30}}
          >
            登録
          </Button>

          <div className="m11-entry-container">
            <TextField
              id="code"
              name="code"
              label="コード*"
              defaultValue=""
              value={data.code}
              variant="standard"
              size="small"
              style={{width:50, marginLeft:20}}
              inputProps={{maxLength:3, style: {textAlign:"center", fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, integerOnly(e.target.value))}
            />
            <TextField
              id="name"
              name="name"
              label="事業部名*"
              defaultValue=""
              value={data.name}
              variant="standard"
              size="small"
              style={{width:200, marginLeft:20}}
              inputProps={{maxLength:15, style: {fontSize:11, fontFamily:"sans-serif"} }}
              InputLabelProps={{ style: {fontSize:11, fontFamily:"sans-serif"} }}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </div>
          <ModalConfirm confirm={confirm} handleOk={handleConfirmOK} handleCancel={handleCofirmCancel} />
        </div>
      ) : (
        <></>
      )}
    </>
  );
  
}
export default DepNewPage;