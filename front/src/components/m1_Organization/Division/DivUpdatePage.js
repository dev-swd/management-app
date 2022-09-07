// m14
import './DivUpdatePage.css';
import { useState, useEffect } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import{ getDiv, updateDiv } from '../../../lib/api/division';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import ModalConfirm from '../../common/ModalConfirm';
import { integerOnly } from '../../../lib/common/InputRegulation';

const initData = {dep_code: "", dep_name: "", department_id: "", code: "", name: ""}

const DivUpdatePage = (props) => {
  const { div, closeUpdDiv, setMessage, refresh } = props;
  const [data, setData] = useState(initData);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(div)) {
      // パラメータ設定ありの場合のみ課情報取得
      handleGetDiv(Number(div.id));
    } 
  }, [div]);

  // 課情報取得
  const handleGetDiv = async (id) => {
    try {
      const res = await getDiv(id);
      setData({
        ...data,
        dep_code: res.data.div.dep_code,
        dep_name: res.data.div.dep_name,
        department_id: res.data.div.department_id,
        code: res.data.div.code,
        name: res.data.div.name,
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "課情報取得エラー"});
    }
  }

  // 画面入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value,
    });
  }

  // 更新ボタン非活性制御
  const setDisabledSubmit = () => {
    if (data.code==="" || data.name==="") {
      return true;
    } else {
      return false;
    }
  }

  // 更新ボタン押下時の処理
  const handleSubmit = (e) => {
    setConfirm({
      ...confirm,
      msg: "課情報を更新します。よろしいですか？",
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
      const res = await updateDiv(div.id, setParam)
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "課情報更新エラー(500)"});
      } else {
        refresh();
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "課情報更新エラー"});
    }
  }

  // 更新用パラメータ設定
  const setParam = {
    department_id: data.department_id,
    code: data.code,
    name: data.name
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
    closeUpdDiv();
    setData({...initData});
    setMessage({kbn: "", msg: ""});
  }

  // 画面表示
  return (
    <>
      { div ? (
        <div className="m14-div-upd-container">
          <div className="m14-header-area">
            <div className="m14-header-title">{"課変更 （" + div.dep_name + "）"}</div>
            <button 
              className="link-style-btn m14-link-close" 
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
            更新
          </Button>

          <div className="m14-before-info">
            <span className="m14-before-title">{"[変更前]"}</span>
            <span className="m14-before-value">{div.code + ": " + div.name}</span>
          </div>

          <div className="m14-entry-container">
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
              label="課名*"
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
export default DivUpdatePage;