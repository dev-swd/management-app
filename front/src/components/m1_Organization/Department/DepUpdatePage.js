// m12
import './DepUpdatePage.css';
import { useState, useEffect } from 'react';
import { isEmpty } from '../../../lib/common/isEmpty';
import { getDep, updateDep } from '../../../lib/api/department';
import Button from '@mui/material/Button';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import TextField from '@mui/material/TextField';
import ModalConfirm from '../../common/ModalConfirm';
import { integerOnly } from '../../../lib/common/InputRegulation';

const initData = {code: "", name: ""}

const DepUpdatePage = (props) => {
  const { dep, closeUpdDep, setMessage, refresh } = props;
  const [data, setData] = useState(initData);
  const [confirm, setConfirm] = useState({msg: "", tag: ""});

  // 初期処理
  useEffect(() => {
    if (!isEmpty(dep)) {
      // パラメータ設定ありの場合のみ事業部情報取得
      handleGetDep(Number(dep.id));
    } 
  }, [dep]);

  // 事業部情報取得
  const handleGetDep = async (id) => {
    try {
      const res = await getDep(id);
      setData({
        ...data,
        code: res.data.dep.code,
        name: res.data.dep.name,
      });
    } catch (e) {
      setMessage({kbn: "error", msg: "事業部情報取得エラー"});
    }
  }

  // 画面入力時の処理
  const handleChange = (name, value) => {
    setData({
      ...data,
      [name]: value
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
      msg: "事業部を更新します。よろしいですか？",
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
      const res = await updateDep(dep.id, data);
      if (res.data.status === 500) {
        setMessage({kbn: "error", msg: "事業部情報更新エラー(500)"});
      } else {
        refresh();
        handleClose();
      }
    } catch (e) {
      setMessage({kbn: "error", msg: "事業部情報更新エラー"});
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
    closeUpdDep();
    setData({...initData});
    setMessage({kbn: "", msg: ""});
  }

  return (
    <>
      { dep ? (
        <div className="m12-dep-upd-container">
          <div className="m12-header-area">
            <div className="m12-header-title">事業部変更</div>
            <button 
              className="link-style-btn m12-link-close" 
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

          <div className="m12-before-info">
            <span className="m12-before-title">{"[変更前]"}</span>
            <span className="m12-before-value">{dep.code + ": " + dep.name}</span>
          </div>

          <div className="m12-entry-container">
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
export default DepUpdatePage;